const getFileExtension = (fileName) => {
    return fileName.split('.').pop();
}

const changeFileExtension = (fileName, newExtension) => {
    const oldExtension = fileName.split('.').pop();
    const lastOccurenceIndex = fileName.lastIndexOf(oldExtension);
    return fileName.slice(0, lastOccurenceIndex) + fileName.slice(lastOccurenceIndex).replace(oldExtension, newExtension);
}

const removeFileExtension = (fileName) => {
    const extension = "." + fileName.split('.').pop();
    return fileName.replace(extension, '');

}

export { changeFileExtension, getFileExtension, removeFileExtension };