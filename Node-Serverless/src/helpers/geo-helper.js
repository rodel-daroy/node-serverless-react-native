const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');

const apiKey = process.env.GOOGLE_API_KEY;


exports.getGeoAddress = async (lat, lng, addNew = false) => {

  lat = parseFloat(lat).toFixed(6);
  lng = parseFloat(lng).toFixed(6);

  let latlng = `${lat},${lng}`;

  let data;

  let geoDataRow = await DbHelper.query('SELECT id, data FROM geo_datas WHERE latlng = :latlng', { latlng }, 1);
  if (geoDataRow) {
    data = JSON.parse(geoDataRow['data']);
  } else {
    let googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${apiKey}`;

    data = await ApiHelper.apiGet(googleUrl);
    await DbHelper.dbInsert('geo_datas',
      {
        latlng: latlng,
        data: JSON.stringify(data),
        created_at: ApiHelper.getCurrentUnixTime(),
        status: 'active'
      }
    );
  }

  let address = '';
  let results = ApiHelper.getObjectValue(data, 'results', []);
  if (results.length > 0) {
    address = ApiHelper.getObjectValue(results[0], 'formatted_address', '');
  }

  return address;
};
