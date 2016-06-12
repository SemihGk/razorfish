# Razorfish-widgets

[Demo](https://razorfish-widget.herokuapp.com).

###### Tasks
1. Build 2 widgets
2. Should work in all major standard browsers and devices
3. One widget should include some sort user interaction with JS (click handler, hides/shows things)
4. JavaScript, CSS, and HTML is best. 
5. Comment your code cleanly and concisely, following standard conventions.
6. Consider using a Google font for styling purposes.
7. Create appealing interactions and styling for those widgets (hover effects, animations, transitions, etc.).
8. Consider the responsive needs of your users.
9. Provide the content for your widgets from an external JSON file.

### Using technologies and libraries
angularjs, nodejs, expressjs, socket.io, CSS, lodash, momentjs, angular-material, angular-animate, google chart apis, jquery, bootstrap, ng-file-upload, angular-socialshare, angular-notification bar, multer, file-type, filechunk, async.  

### First widget(Real time stock chart)
####### Capabilities 
1. Basically two different chart are added.
2. First one is line graph shows the values of stock(updating itself per 2 seconds).
3. Used web socket to update the graph. (but I could not find free live json for values. So, It has been creating randomly.)
4. Comparing consecutive values in graph. When there is an increase or decrease, graph ui is changing.
5. Second one is column graph shows the values of stock(same purpose with first one.)
6. Also secondly change rate can be seen on right bottom.

### Second widget(Dynamic file uploader).
1. User can upload files or share them on twitter.
2. 2 charts are included: donut graph and column graph.
3. First tab shows file type size in the storage(audio, photo and video).
4. Second tab shows the file counts in the storage.
5. After files dynamically added, ui is updating. 
6. Error check control are defined. 
7. File upload progress can be seen during uploading(then disappearing).
8. Used REST(express) api to communicate with back-end.  
9. Size and counts are calculated correctly per upload.


### General features
1. Responsive design
2. Dynamic ui
3. Error checks
4. User friendly.
5. Maintainable.
6. Commented code design.
 
####### Screenshots
![alt tag](https://cloud.githubusercontent.com/assets/5814582/15993140/1cefa06c-30ab-11e6-9f5e-e6e0b7e6dc40.png)
![Alt text](https://cloud.githubusercontent.com/assets/5814582/15993141/1cfd6d8c-30ab-11e6-8515-f01004d23b2d.png)
![alt tag](https://cloud.githubusercontent.com/assets/5814582/15993142/1d018b88-30ab-11e6-89fd-bbb5991b7058.png)

