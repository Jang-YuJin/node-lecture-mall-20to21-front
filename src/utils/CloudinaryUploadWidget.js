import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "../App.css";
import "../common/style/common.style.css";

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

class CloudinaryUploadWidget extends Component {
  componentDidMount() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
        multiple: false
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary widget error:", error);
          return;
        }
        if (!result) return;

        // 디버깅용: 어떤 이벤트들이 오는지 확인
        console.log("Cloudinary event:", result.event, result);

        if (result.event === "success") {
          this.props.uploadImage(result.info.secure_url); // ✅ React state 업데이트만!
        }
        // if (!error && result && result.event === "success") {
        //   console.log("Done! Here is the image info: ", result.info);
        //   document
        //     .getElementById("uploadedimage")
        //     .setAttribute("src", result.info.secure_url);
        //   this.props.uploadImage(result.info.secure_url);
        // }
      } //https://cloudinary.com/documentation/react_image_and_video_upload
    );
    document.getElementById("upload_widget").addEventListener(
      "click",
      function () {
        myWidget.open();
      },
      false
    );
  }

  render() {
    return (
      <Button id="upload_widget" size="sm" className="ml-2" variant="outline-primary">
        업로드
      </Button>
    );
  }
}

export default CloudinaryUploadWidget;
