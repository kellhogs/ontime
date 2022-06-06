import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        borderRadius: '4px',
      },
    },
    Input: {
      baseStyle: {
        borderRadius: '4px',
        _hover: {
          backgroundColor: 'red',
        }
      },
    },
  },
});

export default theme;
