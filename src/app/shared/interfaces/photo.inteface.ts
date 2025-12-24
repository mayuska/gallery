/** Interface representing a photo object */
export interface Photo {
  /** The unique identifier for the photo */
  id: string;
  /** The URL of the photo */
  url: string;
  /** The URL of the thumbnail version of the photo */
  thumbPhotoUrl: string;
  /** The author of the photo */
  author: string;
  /** The download URL of the photo */
  download_url: "https://picsum.photos/id/0/5000/3333"
  /** The height of the photo big size */
  height: number
  /** The width of the photo big size */
  width: number
}
