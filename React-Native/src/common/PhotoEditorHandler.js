import { PESDK, Configuration, TintMode } from 'react-native-photoeditorsdk';
import CONSTANTS from '../common/PeertalConstants';

const iosLicense = '../assets/pesdk/pesdk_ios_license.json';
const androidLicense = '../assets/pesdk/pesdk_android_license.json';

if (CONSTANTS.OS == 'ios') {
  PESDK.unlockWithLicense(require(iosLicense));
} else {
  PESDK.unlockWithLicense(require(androidLicense));
}

export const PhotoEditorWithImage = (image, func) => {
  // Set up configuration
  let configuration: Configuration = {
    // Configure sticker tool
    sticker: {
      // Enable personal stickers
      personalStickers: false,
      // Configure stickers
      /* categories: [
        // Create sticker category with stickers
        {
          identifier: 'example_sticker_category_logos',
          name: 'Logos',
          thumbnailURI: require('../assets/pesdk/React-Logo.png'),
          items: [
            {
              identifier: 'example_sticker_logos_react',
              name: 'React',
              stickerURI: require('../assets/pesdk/React-Logo.png'),
            },
            {
              identifier: 'example_sticker_logos_imgly',
              name: 'img.ly',
              stickerURI: require('../assets/pesdk/imgly-Logo.png'),
              tintMode: TintMode.SOLID,
            },
          ],
        },
        // Use existing sticker category
        {identifier: 'imgly_sticker_category_emoticons'},
        // Modify existing sticker category
        {
          identifier: 'imgly_sticker_category_shapes',
          items: [
            {identifier: 'imgly_sticker_shapes_badge_01'},
            {identifier: 'imgly_sticker_shapes_arrow_02'},
            {identifier: 'imgly_sticker_shapes_spray_03'},
          ],
        },
      ], */
    },
  };
  PESDK.openEditor(image, configuration).then(result => {
    func(result);
  });
};
