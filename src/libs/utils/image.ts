// 중복 이미지 제거
export const removeDuplicateImages = (images: FileList): FileList => {
    const imageMap = new Map();
    Array.from(images).forEach((image) => {
        imageMap.set(image.name, image);
    });

    const dataTransfer = new DataTransfer();
    Array.from(imageMap.values()).forEach((image: File) => {
        dataTransfer.items.add(image);
    });

    return dataTransfer.files;
};
