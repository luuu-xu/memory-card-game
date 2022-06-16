const DIGIMONS = [];

function importAll(r) {
  r.keys().forEach((item) => {
    DIGIMONS.push({
      name: item.replace('./', '').replace('.png', ''),
      url: r(item)
    });
  });
};

importAll(require.context('./img', false, /\.(png)$/));

export default DIGIMONS;

