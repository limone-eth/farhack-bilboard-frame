import { Image } from "@nextui-org/react";

export const DragNDropImage = ({
  setSelectedFile,
  uploadedImage,
  setUploadedImage,
}: {
  setSelectedFile: (file: any) => void;
  uploadedImage: string,
  setUploadedImage: (image: string) => void;
}) => {
  const onSelectedFile = (event: any) => {
    const reader = new FileReader();
    console.log(event?.target.files[0]);
    reader.addEventListener("load", () => {
      setUploadedImage(reader.result?.toString() || "");
      console.log(reader);
    });
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFile(event?.target.files[0]);
  };
  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1/2">
        <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-blue-500">
                Click to upload
              </span>{" "}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (1:1 ratio)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={onSelectedFile}
          />
        </label>
      </div>
      <div className="flex-1/2">
        {
          // show the uploaded image if it exists
          uploadedImage ? (
            <Image className="w-64 h-64" src={uploadedImage} />
          ) : (
            <div className="h-64 w-64"></div>
          )
        }
      </div>
    </div>
  );
};
