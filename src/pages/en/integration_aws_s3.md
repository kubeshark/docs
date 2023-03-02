---
title: Upload Files to AWS S3
description: Upload Files to AWS S3
layout: ../../layouts/MainLayout.astro
---


**Kubeshark** enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. AWS S3).



```js
// Upload a PCAP Snapshot to an AWS S3 Bucket If Response Status Code is 500

function onItemCaptured(data) {
  if (data.response.status === 500) {
    // Create a temporary directory
    var dir = file.mkdirTemp("snapshot");

    // Create the PCAP snapshot in temp directory
    pcap.snapshot(dir);

    // Dump the name resolution history into a file
    var nameResolutionHistory = pcap.nameResolutionHistory();
    file.write(
      dir + "/name_resolution_history.json",
      JSON.stringify(nameResolutionHistory)
    );

    // Create an archive from the directory
    var tarFile = file.tar(dir)

    // Upload TAR file to S3 bucket
    vendor.s3.put(
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      S3_BUCKET,
      tarFile
    );
    console.log("Uploaded PCAP snapshot to S3:", tarFile);

    /*
    The TAR file kubeshark_<TIMESTAMP>.tar.gz can now be downloaded from the Amazon S3 bucket.
    Use `kubeshark tap --pcap <TAR_FILE_PATH>` command to capture from the PCAP snapshot (.tar.gz file)
    */

    // Clean up the temporary files and directories
    file.delete(dir);
    file.delete(tarFile);
  }
}
```
