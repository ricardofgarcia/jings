function getProjectProperty(key) {
    try {
      const scriptProperties = PropertiesService.getScriptProperties();
      const value = scriptProperties.getProperty(key);
      //console.log('%s %s', key, value);
      return value;
    } catch (err) {
      // TODO (developer) - Handle exception
      //console.log('Failed with error %s', err.message);
      return null;
    }
  }
  
  function getProjectProperties(){
    try {
      // Get multiple script properties in one call, then log them all.
      const scriptProperties = PropertiesService.getScriptProperties();
      const data = scriptProperties.getProperties();
      for (const key in data) {
        console.log('Key: %s, Value: %s', key, data[key]);
      }
    } catch (err) {
      // TODO (developer) - Handle exception
      console.log('Failed with error %s', err.message);
    }
  }
  