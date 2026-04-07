require('dotenv').config();
const { Comics } = require('./version/v2/index');

(async () => {
  try {
    console.log('Domain:', process.env.NETTRUYEN_BASE_URL);
    console.log('Testing getNewComics...');
    const result = await Comics.getNewComics('all', 1);
    console.log('OK:', result.comics?.length || 0);
    if (result.comics?.length > 0) {
      console.log('First comic:', JSON.stringify(result.comics[0], null, 2));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
  process.exit(0);
})();