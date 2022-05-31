import Color from 'color';

/**
 * @description Selects text colour to maintain accessible contrast
 * @param bgColour
 * @return {{backgroundColor, color: string}}
 */
export const getAccessibleColour = (bgColour) => {
  if (bgColour != null && bgColour !== '') {
    try {
      const textColor = Color(bgColour).isLight() ? 'black' : 'white';
      return { backgroundColor: bgColour, color: textColor };
    } catch (error) {
      console.log(`Unable to parse colour: ${bgColour}`);
    }
  }
};
