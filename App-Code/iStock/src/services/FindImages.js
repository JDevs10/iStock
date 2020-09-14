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
            
                await RNFS.unlink(IMAGE_PATH)
                    .then(async () => {
                        console.log('OLD Repertory deleted');
                    })
                    .catch(async (err) => {
                        console.log(err.message);
                    });
                await RNFS.mkdir(IMAGE_PATH).then(async (success) => {
                    let lg = productList.length;
                    for (let i = (lg-20); i < lg; i++) {
                        let expectedBytes__ = 0;
                        console.log(`url => ${token.server}/api/ryimg/product_v2.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${productList[i].ref}`);

                        await RNBackgroundDownloader.download({
                            id: String(i),
                            url: `${token.server}/api/ryimg/product_v2.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${productList[i].ref}`,
                            destination: `${IMAGE_PATH}/${productList[i].ref}.${PREFIX}`,
                            headers: {
                                DOLAPIKEY: token.token,
                                Accept: 'application/json',
                            }
                        }).begin(async (expectedBytes) => {
                            expectedBytes__ = expectedBytes;
                            console.log(`Going to download ${expectedBytes} bytes!`);

                            if (expectedBytes <= 25) {
                                console.log('Image : ' + i + ' - ' + productList[i].ref + ' => EMPTY [WILL BE DELETED]');
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
                        });
                    }
                });
            });
        }

        return await result;
    }
}