//Todo asignar datos de armas a weaponData
//https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/refs/heads/master/weapons.json
var weaponData = [];

var weapons = [];
var weaponsTranslations = new Map();

const keysException = ['TranslatedLabel','TranslatedDescription','Tints','Components','Liveries'];
const keysTranslations = ['TranslatedLabel', 'TranslatedDescription'];

weaponData.forEach(function(weapon){
    var weaponObject = {};
    for (const [key, value] of Object.entries(weapon)) {
        if(keysException.includes(key)){
        var constHash = null;
        if(keysTranslations.includes(key) && value && value.length !== 0){
            constHash = value.Hash;
            setTranslate(value);
        }else if(value && value.length !== 0){
            value.forEach(function(keyObject){
                for (const [key2, value2] of Object.entries(keyObject)) {
                    if(keysTranslations.includes(key2) && value2 && value2.length !== 0){
                        keyObject[key2] = value2.Hash;
                        setTranslate(value2);
                    }
                }
            })
        }
        if(!constHash){
            weaponObject[key] = value;	
        }else{
            weaponObject[key] = constHash;
        }
        }else{
        weaponObject[key] = value;
        }
    }
    weapons.push(weaponObject);
});

weaponsTranslations = [...weaponsTranslations.values()].map(({ Hash, Name, Translations }) => ({
    Hash,
    Name,
    Translations
}));

function setTranslate(objectInfo){
    if(objectInfo.Hash !== 0){
        var translationObject = {};
        translationObject.Hash = objectInfo.Hash;
        translationObject.Name = objectInfo.Name;
        translationObject.Translations = objectInfo;
        if(!weaponsTranslations.get(translationObject.Hash)){
            delete translationObject.Translations.Hash;
            delete translationObject.Translations.Name;
            weaponsTranslations.set(translationObject.Hash.toString(), translationObject);
        }
    }
}



/*
<html>
	<header>
		<script type="text/javascript">
			var test = [];

		var weapons = [];
		var weaponsTranslations = new Map();

		const keysException = ['TranslatedLabel','TranslatedDescription','Tints','Components','Liveries'];
		const keysTranslations = ['TranslatedLabel', 'TranslatedDescription'];

		test.forEach(function(weapon){
			var weaponObject = {};
			for (const [key, value] of Object.entries(weapon)) {
		      if(keysException.includes(key)){
		      	var constHash = null;
		      	if(keysTranslations.includes(key) && value && value.length !== 0){
		      		constHash = value.Hash;
		      		setTranslate(value);
		      	}else if(value && value.length !== 0){
		      		value.forEach(function(keyObject){
		      			for (const [key2, value2] of Object.entries(keyObject)) {
			      			if(keysTranslations.includes(key2) && value2 && value2.length !== 0){
			      				keyObject[key2] = value2.Hash;
					      		setTranslate(value2);
					      	}
			      		}
		      		})
		      	}
		      	if(!constHash){
		      		weaponObject[key] = value;	
		      	}else{
		      		weaponObject[key] = constHash;
		      	}
		      }else{
		      	weaponObject[key] = value;
		      }
			}
			weapons.push(weaponObject);
		});

		weaponsTranslations = [...weaponsTranslations.values()].map(({ Hash, Name, Translations }) => ({
		  Hash,
		  Name,
		  Translations
		}));

		function setTranslate(objectInfo){
			if(objectInfo.Hash !== 0){
				var translationObject = {};
				translationObject.Hash = objectInfo.Hash;
				translationObject.Name = objectInfo.Name;
      			translationObject.Translations = objectInfo;
      			if(!weaponsTranslations.get(translationObject.Hash)){
      				delete translationObject.Translations.Hash;
      				delete translationObject.Translations.Name;
      				weaponsTranslations.set(translationObject.Hash.toString(), translationObject);
      			}
			}
		}
		</script>
	</header>
	<body></body>
</html>


*/
