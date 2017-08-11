import * as AWS from 'aws-sdk';
import {ListObjectsV2Request, ObjectList} from "aws-sdk/clients/s3";

export function listBlogPosts(bucketName: string): Promise<ObjectList> {
    let s3 = new AWS.S3();

    return new Promise((resolve, reject) => {
        s3.listObjectsV2(getListObjectsV2Request(bucketName),(err, data) => {
           if (!err) {
               resolve(data.Contents)
           } else {
               reject(err)
           }
        });
    });
}

function getListObjectsV2Request(bucketName: string): ListObjectsV2Request {
    return {
        Bucket: bucketName
    }
}