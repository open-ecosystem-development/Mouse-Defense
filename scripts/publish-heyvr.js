/**
 * Copyright (c) 2023 Jonathan Hale
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Script to publish to HeyVR.
 *
 * API documentation here:
 * https://docs.heyvr.io/en/developer-area/publish-a-game#h-2-upload-via-api
 */

import axios from 'axios';
import FormData from 'form-data';
import archiver from 'archiver';
import fs from 'node:fs';
import stream from 'stream';

function zipDeployFolder() {
    const archive = archiver.create('zip', {
        zlib: { level: 9 }
    });

    const output = new stream.PassThrough();

    const promise = new Promise((res, rej) => {
        const buffers = [];
        archive.pipe(output);

        /* Add contents of deploy or public */
        if(fs.existsSync('../deploy')) {
            archive.directory('../deploy', false);
        } else {
            archive.directory('../public', false);
        }
        archive.on('error', rej);

        output.on('data', (d) => {
            buffers.push(d);
        });
        output.on('end', () => {
            res(Buffer.concat(buffers));
        });

        archive.finalize();
    });

    return promise;
}


async function main() {
    if(!process.argv[2]) {
        console.error("Missing version argument.");
        process.exit(1);
    }

    let version = 'patch';
    if(process.argv[2].endsWith('.0.0')) {
        version = 'major';
    } else if(process.argv[2].endsWith('.0')) {
        version = 'minor';
    }

    const gameFile = await zipDeployFolder().catch(console.error);
    console.log('Publishing', version, `version (${gameFile.length/1000} kB)`);

    const buildData = new FormData();
    buildData.append( 'game_slug', 'mouse-defense' );
    buildData.append( 'game_file', gameFile, 'game.zip' );
    buildData.append( 'version', version );
    buildData.append( 'sdk_version', 1 );

    const accessToken = process.env.HEYVR_ACCESS_TOKEN;
    axios({
        method: 'post',
        url: 'https://heyvr.io/api/developer/game/upload-build',
        data: buildData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        onUploadProgress: (e) => {
            console.log('Upload progress:', 100*e.progress.toFixed(2), '%');
        }
    })
        .then(res => {
            if(res.status === 200) {
                console.log('Successfully published to HeyVR.');
            } else {
                console.log("Upload failed with code", res.status);
                console.log(res.data)
                process.exit(1);
            }
        })
        .catch(error => {
            console.error("Request failed with error:");
            console.error(error.toString(), `(${error.response?.statusText})`);
            console.log(error.response.data);
            process.exit(1);
        })
}
main();
