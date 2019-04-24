GetOutfits = () => {
  let data = {
    0: {
      id: 0,
      name: 'Outfit 0',
      src: 'http://placehold.it/200x200?text=Outfit_0',
      dates: ['2019-03-10', '2019-03-19', '2019-03-04'],
      garments: [0, 1]
    },
    1: {
      id: 1,
      name: 'Outfit 1',
      src: 'http://placehold.it/200x200?text=Outfit_1',
      dates: ['2019-03-12'],
      garments: [2]
    },
    2: {
      id: 2,
      name: 'Outfit 2',
      src: 'http://placehold.it/200x200?text=Outfit_2',
      dates: ['2019-03-10'],
      garments: [0]
    },
    3: {
      id: 3,
      name: 'Outfit 3',
      src: 'http://placehold.it/200x200?text=Outfit_3',
      dates: ['2019-03-15'],
      garments: [1, 2]
    }
  };
  return Promise.resolve(data);
}

GetGarments = () => {
  let data = {
    0: {
      id: 0,
      name: 'Garment 0',
      src: 'http://placehold.it/200x200?text=Garment_0',
      types: ['Type A'],
      tags: ['Tag A', 'Tag B'],
      brand: "Gucci"
    },
    1: {
      id: 1,
      name: 'Garment 1',
      src: 'http://placehold.it/200x200?text=Garment_1',
      types: ['Type B', 'Type C'],
      tags: ['Tag C'],
      brand: "Tricks"
    },
    2: {
      id: 2,
      name: 'Garment 2',
      src: 'http://placehold.it/200x200?text=Garment_2',
      types: ['Type C'],
      tags: ['Tag A'],
      brand: "Blud"
    }
  };
  return Promise.resolve(data);
}

GetScore = () => {
  let score = .35;
  return Promise.resolve(score);
}

GetTrending = () => {
  let trending = "dogs";
  return Promise.resolve(trending);
}

export default function GetData() {
  console.log("Loading...")
  return Promise.all([ GetOutfits(), GetGarments(), GetScore(), GetTrending() ])
    .then(data => {
      global.outfits = data[0];
      global.garments = data[1];
      global.score = data[2];
      global.trending = data[3];
      console.log("Done");
    });
}
