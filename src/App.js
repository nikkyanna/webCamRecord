import { useEffect, useRef, useState } from "react";

import firebase from "./firebase";
import { useRecordWebcam } from "react-record-webcam";

const videoType = "video/webm";
const App = (props) => {
  const [start, isStart] = useState(false);
  const [videoListing, setVideoListing] = useState([]);
  const recordWebcam = useRecordWebcam();
  const didMount = useRef(false);

  const saveFile = async () => {
    const blob = await recordWebcam.getRecording();
    const file = new File([blob], getFileName(), { type: videoType });
    saveFileToFireStore(file);
    isStart(false);
  };

  const getFileName = () => {
    let d = new Date();
    let dformat = `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    return dformat;
  };

  const saveFileToFireStore = (file) => {
    let bucketname = "videos";
    let storageRef = firebase.storage().ref(`${bucketname}/${file.name}`);

    // 'file' comes from the Blob or File API
    let upload = storageRef.put(file).then((snapshot) => {
      showUploadedVideo();
    });
  };

  const showUploadedVideo = () => {
    var fileURLs = [];
    let storageRef = firebase.storage().ref("videos");

    // Now we get the references of these videos folder
    storageRef
      .listAll()
      .then((result) => {
        result.items.forEach((videoRef) => {
          videoRef
            .getDownloadURL()
            .then((url) => {
              fileURLs.push(url);
              setVideoListing([...new Set(fileURLs)]);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const startRecording = () => {
    recordWebcam.open().then(() => {
      isStart(true);
    });
  };

  const stopRecording = () => {
    recordWebcam.stop().then(() => {
      saveFile();
    });
  };

  useEffect(() => {
    if (didMount.current) recordWebcam.start();
    else didMount.current = true;
  }, [start]);

  useEffect(() => {
    showUploadedVideo();
  }, []);

  return (
    <div>
      <button onClick={startRecording}>Start recording</button>
      <button onClick={stopRecording}>Stop recording</button>
      <video controls ref={recordWebcam.webcamRef} autoPlay />

      <div>
        <h3>Recorded videos:</h3>
        {videoListing.length > 0
          ? videoListing.map((videoURL, i) => (
              <div key={`video_${i}`}>
                <video style={{ width: 200 }} src={videoURL} controls />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};
export default App;
