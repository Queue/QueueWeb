export default {

  // filter through the data to find the phone number
  getParentsOfPhonenumber(data, phone) {
    for (let i in data) {
      for (let j in data[i]) {
        if (data[i][j].phoneNumber === phone) {
          return {
            parent: i,
            child: j,
          };
        }
      }
    }
  },

};
