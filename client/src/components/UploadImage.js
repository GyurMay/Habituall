const { backendAPI } = require("../clientDotEnv");

const UploadImage = props => {
 return (
       <div className="mula" onClick={props.onClick} style={{color:'white'}}>
        <iframe name="dummyframe" id="dummyframe" style={{display: 'none'}}></iframe>
            <form target="dummyframe" action={backendAPI+ "/imageUpload"} encType="multipart/form-data" method="POST">
                <input name="img" accept=".png,.img,.jpg" type="file" id="imgFile" />
                <button>submit</button>
            </form>
        </div>
 );
}

 export default UploadImage;