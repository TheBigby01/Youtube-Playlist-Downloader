const {Spider} = require('get-all-links');
const fs = require('fs');
const ytdl = require('ytdl-core');

//Changeable Variables

let downloadPlaylist = true; //True : Downloads Playlist //False : Downloads Single Video

let downloadLink = 'https://www.youtube.com/watch?v=wEyEd5J8xFs&list=PL_XxuZqN0xVACRK3AAAi4lNivb1-2meET&index=1'; //Playlist / Video Link

let destination = 'H:'; //Video Save Destination

let ignoreVideo = [1,2,3];

//Changeable Variables

var urlDepth = 2;


if(downloadPlaylist==true){

	var urlList = [];
	const getAllLinks = new Spider({
		depth : urlDepth,
		url : downloadLink,
		onSuccess : (link)=>{
			if(link.includes('watch') && link.includes('index'))urlList.push(link);
			//console.log(link);
		},
		onFailure : (link)=>{

		},
		onFinsh : (data)=>{
			async function startDownload(){
					for(i of urlList){
					 await downloadVideo(i);
					}
				}
			startDownload();
		}
	});
	getAllLinks.crawl();
}
else{
	downloadVideo(downloadLink);
}

async function downloadVideo(link){
	var videoNo = link.split('index=');
	var videoTitle;
	await ytdl.getBasicInfo(link,(err,res)=>videoTitle = res.title);
	videoTitle = videoTitle.toLowerCase();
	for(i=0;i<ignoreVideo.length;i++)
		if(ignoreVideo[i]==Number(videoNo[1])){
			console.log(`Ignoring video no ${videoNo[1]} : ${videoTitle}` );
			return;
		}
	for(i=0;i<videoTitle.length;i++){
		videoTitle = videoTitle.replace('/','_');
		videoTitle = videoTitle.replace('\\','_');
		videoTitle = videoTitle.replace(':','_');
		videoTitle = videoTitle.replace('*','_');
		videoTitle = videoTitle.replace('?','_');
		videoTitle = videoTitle.replace('"','_');
		videoTitle = videoTitle.replace('<','_');
		videoTitle = videoTitle.replace('>','_');
		videoTitle = videoTitle.replace('|','_');
		videoTitle = videoTitle.replace(' ','_');
	};
	var fileName = `${destination}//${videoTitle}.mp4`;
	console.log(`Downloading video no ${videoNo} at ${fileName}`);
	await ytdl(link).pipe(fs.createWriteStream(fileName));
	return;
}