export const pinToPinata = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const metadata = JSON.stringify({
    name: "File name",
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);
  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!data.IpfsHash) {
    console.error("Error pinning to Pinata", data);
  }
  return data.IpfsHash;
};
