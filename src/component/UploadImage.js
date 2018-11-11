import React from 'react';
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import {compose, withHandlers} from 'recompose'
import Dropzone from 'react-dropzone'
import {map} from 'lodash'

const filePath = 'uploadedFiles';

const handlers = {
    onFileDrop: props => files => {
        return props.firebase.uploadFiles(filePath, files, filePath)
    },
    onFileDelete: props => (file, key) => {
        return props.firebase.deleteFile(file.fullPath, `${filePath}/${key}`)
    }
}

const enhance = compose(
    firebaseConnect([{path: filePath}]),
    connect(({firebase: {data}}) => ({
        uploadedFiles: data[filePath]
    })),
    withHandlers(handlers)
)

const UploadImage = ({uploadedFiles, onFileDrop, onFileDelete}) => (
    <div>
        <Dropzone onDrop={onFileDrop}>
            <div>Drag and drop image here or click to select</div>
        </Dropzone>
        {uploadedFiles && (
            <div>
                <h3>Uploaded file(s):</h3>
        {map(uploadedFiles, (file, key) => (
          <div key={file.name + key}>
            <span>{file.name}</span>
            <button onClick={() => onFileDelete(file, key)}>Delete File</button>
          </div>
        ))}
            </div>
        )}
    </div>
)

export default enhance(UploadImage)