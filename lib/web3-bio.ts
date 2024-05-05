interface Link {
  link: string;
  handle: string;
}

interface Links {
  farcaster: Link;
}

interface Profile {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string;
  description: string;
  email: string | null;
  location: string | null;
  header: string | null;
  contenthash: string | null;
  links: Links;
}

export const fetchAddressFallbackAvatar = async (
  address: string
): Promise<{
  avatar: string;
  link: string;
}> => {
  const res = await fetch(`https://api.web3.bio/profile/${address}`);
  const profile: Profile[] = await res.json();
  const farcasterProfile = profile.find((p) => p.platform === "farcaster");
  const lensProfile = profile.find((p) => p.platform === "lens");
  const ensProfile = profile.find((p) => p.platform === "ens");
  if (farcasterProfile?.avatar) {
    return {
      avatar: farcasterProfile.avatar,
      link: farcasterProfile.links.farcaster.link,
    };
  }
  if (ensProfile?.avatar) {
    return {
      avatar: ensProfile.avatar,
      link: ensProfile.links.farcaster.link,
    };
  }
  if (lensProfile?.avatar) {
    return {
      avatar: lensProfile.avatar,
      link: lensProfile.links.farcaster.link,
    };
  }
  return {
    avatar: "",
    link: "",
  };
};
