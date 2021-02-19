import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import axios from 'axios';
import RNBackgroundDownloader from 'react-native-background-downloader';
import ProductsManager from '../Database/ProductsManager';

let doneEvent = null;
const RNFS = require('react-native-fs');
const IMAGE_PATH = RNFS.DocumentDirectoryPath + '/iStock/produits/images';
const PREFIX = "jpg";

export default class FindImages extends Component {
    constructor(props) {
        super(props);
    }

    async getAllProduitsImagesFromServer(token){
        let result = false;
        const productsManager = new ProductsManager();
        await productsManager.initDB();
        
        // get a list of products
        const productList = await productsManager.GET_PRODUCT_LIST().then(async (value) => {
            return await value;
        });
        console.log("productList => "+productList.length);
        
        if(productList.length > 0){
            // get image from server
            // and save on devices then update image file location in db

            return await new Promise(async (resolve) => {
                let imagesDownloaded = 0;
                console.log('IMAGE_PATH : ', IMAGE_PATH);
                // console.log('IMAGE_PATH : ', RNFS);
            
                await RNFS.unlink(IMAGE_PATH)
                .then(async () => {
                    console.log('OLD Repertory deleted');
                })
                .catch(async (err) => {
                    console.log(err.message);
                });

                try{
                    await RNFS.mkdir(IMAGE_PATH).then(async (success) => {
                        let lg = productList.length;
                        console.log('lg => ', lg);

                        for (let i = 0; i < lg; i++) {
                            let expectedBytes__ = 0;
                            
                            const url = `${token.server}/custom/istock/backend/download_product.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${productList[i].ref}`;
                            console.log(`url => ${url}`);
    
                            await RNFS.downloadFile({
                                fromUrl: url,
                                toFile: `${IMAGE_PATH}/${productList[i].ref}.${PREFIX}`,
                                begin: async (res: DownloadBeginCallbackResult) => {
                                    console.log("===================================================");
                                    console.log("=== Response begin ================================");
                                    console.log(res, "\n");
                                },
                                progress: async (res: DownloadProgressCallbackResult) => {
                                    //here you can calculate your progress for file download
                                    console.log("===================================================");
                                    console.log("=== Response written ==============================");

                                    let progressPercent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
                                    console.log("=== progress ======================================");
                                    console.log("Percent : ", progressPercent);
                                    console.log(res, "\n\n");
                                },
                            }).promise.then(async (r) => {
                                // Update image path on device in db
                                const res = await productsManager.UPDATE_IMAGE(productList[i]).then(async (value) => {
                                    return await value;
                                });
    
                                console.log("i => " +(i+1) +" == "+lg);
                                if((i+1) == lg){
                                    console.log("DOWNLOADS DONE!");
                                    console.log(imagesDownloaded + "/" + productList.length + " downloaded.");
                                    await resolve(true);
                                }
                            });

                            /*
                            await RNBackgroundDownloader.download({
                                id: String(i),
                                url: `${url}`,
                                destination: `${IMAGE_PATH}/${productList[i].ref}.${PREFIX}`,
                                headers: {
                                    DOLAPIKEY: token.token,
                                    Accept: 'application/json',
                                }
                            }).begin(async (expectedBytes) => {
                                expectedBytes__ = expectedBytes;
                                console.log(`Going to download ${expectedBytes} bytes!`);
    
                                if (expectedBytes <= 25) {
                                    console.log('Image : ' + i + ' - ' + IMAGE_PATH+'/' + productList[i].ref + ' => EMPTY [WILL BE DELETED]');
                                    await RNFS.unlink(IMAGE_PATH+'/' + productList[i].ref + '.${PREFIX}');
                                }else{
                                    imagesDownloaded++;
                                }
                            }).done(async () => {
                                productList[i].image = `${IMAGE_PATH}/${productList[i].ref}.${PREFIX}`;
                                console.log('Image : ' + i + ' - ' + productList[i].ref + ' => DOWNLOADED');
                                
                                // Update image path on device in db
                                const res = await productsManager.UPDATE_IMAGE(productList[i]).then(async (value) => {
                                    return await value;
                                });
    
                                console.log("i => " +(i+1) +" == "+lg);
                                if((i+1) == lg){
                                    console.log("DOWNLOADS DONE!");
                                    console.log(imagesDownloaded + "/" + productList.length + " downloaded.");
                                    return await resolve(true);
                                }
                            }).error(async (error) => {
                                console.log('error => ', error);
                                if ((lg - 1) === i) {
                                    result = true;
                                    console.log('telechargement complet');
                                    return await resolve(result);
                                }
                                return await resolve(false);
                            });
                            */
                        }
                        console.log(`No download`);
                        return await resolve(false);

                    }).catch(async (err) => {
                        console.log("err mkdir : ", err);
                        return await resolve(false);
                    });
                }catch(error){
                    console.log("catch error : ", error);
                    return await resolve(false);
                }
            });
        }

        return await result;
    }

    downloadProgressCallbackResult(res){

    }

    async getLocalImages(){
        return await new Promise(async (resolve) => {

            const RNFS = require('react-native-fs');
            // get a list of files and directories in the main bundle
            await RNFS.readDir(IMAGE_PATH)
                .then(async (result) => {
                    const paths = [];

                    for(let index = 0; index < result.length; index++){
                        paths.push({uri: result[index].path});
                    }
                    console.log('GOT RESULT : ', paths);
            
                    // stat the first file
                    return paths;
                })
                .then(async (statResult) => {
                    console.log('GOT statResult : ', statResult.length);
                    
                    await resolve(statResult.length);
                })
                .then(async (contents) => {
                    // log the file contents
                    console.log('NOT reading contents!');
                })
                .catch(async (err) => {
                    console.log(err.message, err.code);
                    await resolve(false);
                });
        });
    }

    async deleteAll(){
        return await new Promise(async (resolve) => {
            console.log('Deleting '+IMAGE_PATH+' directory...');

            const RNFS = require('react-native-fs');
            await RNFS.unlink(IMAGE_PATH)
                .then(async () => {
                    console.log('Repertory '+IMAGE_PATH+' deleted!');
                    await resolve(true);
                })
                .catch(async (err) => {
                    console.log('deleteAll() => error ',err.message);
                    await resolve(false);
                });
        });
    }
}