export async function getImage(url: string) {
    const response = await fetch(url);
    return response.blob();
}


//this will make a request to the logo api and return an image 
//we need to know what type it is and return the correct image

//since we know the possible options we can just use a switch statement to return the correct image
//we will just do a switch 

//https://img.logo.dev/google.com?token=pk_VUQ02aSSQWavJaDMW2idOQ


  

    export async function retrieveLogo(accountType: string) {
        let cleanedDomain: string | null = null;
        
        switch (accountType) {
            case "fxr":
            case "factory-ride":
            case "adrenaline":
                cleanedDomain = "fxrracing.com";
                break;
            case "gmail":
                cleanedDomain = "gmail.com";
                break;
            case "outlook":
                cleanedDomain = "outlook.com";
                break;
            case "yahoo":
                cleanedDomain = "yahoo.com";
                break;
            case "aol":
                cleanedDomain = "aol.com";
                break;
            case "icloud":
                cleanedDomain = "icloud.com";
                break;
            default:
                cleanedDomain = "fxrracing.com";
               
        }
        
        if (!cleanedDomain) return null;
        
        try {
        //console.log(`${process.env.NEXT_PUBLIC_ICON_API_BASE_URL}/${cleanedDomain}?token=${process.env.NEXT_PUBLIC_ICON_API_KEY}`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ICON_API_BASE_URL}/${cleanedDomain}?token=${process.env.NEXT_PUBLIC_ICON_API_KEY}`);
        
        // Check if response is OK
      if (!response.ok) return null;
      return response.url;
    } catch (error) {
      console.error("Error fetching icon:", error);
      return null;
    }
  }
  
  