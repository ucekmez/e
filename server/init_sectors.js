import { Sectors } from '/imports/api/collections/positions.js'; // Positions collections


Meteor.startup(() => {
  if (Sectors.find().count() === 0) {
    sector_info = [
      { name: "Textile" },
      { name: "Health" },
      { name: "Construction" },
      { name: "Automotive" },
      { name: "Service" },
      { name: "IT" },
      { name: "Manufacturing" },
      { name: "Commercial" },
      { name: "Retail" },
    ];

    sector_info.forEach(function(s) {
      const q_id = Sectors.insert({
        name: s.name,
        slug: s.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-') // slugify
      });
    });
    console.log("sector info are added");

  }
});
