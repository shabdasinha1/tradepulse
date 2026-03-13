export const sortCountries = (countries = []) => {
  return [...countries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

export const buildCountryNumericMap = (countries = []) => {
  return countries.reduce((acc, country) => {
    acc[country.numeric] = country.name;
    return acc;
  }, {});
};