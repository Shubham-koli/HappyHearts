const { ReplaceWithCipher, decrypt_promise } = require("./decryption-promise");

let decrypt_patientData = (data, CIPHER_KEY) => {
  return new Promise((resolve, reject) => {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (
          key == "$class" ||
          key == "AdharNo" ||
          key == "EHR_ID" ||
          key == "patientData"
        ) {
        } else if (key == "TreatmentDetails") {
          data[key].forEach(subKey => {
            //console.log(subKey);
            for (let field in subKey) {
              if (subKey.hasOwnProperty(field)) {
                let value = subKey[field];
                if (
                  field == "$class" ||
                  field == "transactionId" ||
                  field == "timestamp" ||
                  field == "patientData"
                ) {
                  //console.log(value);
                } else {
                  decrypt_promise(value, CIPHER_KEY)
                    .then(
                      res => {
                        ReplaceWithCipher(subKey, field, res)
                          .then(res1 => {
                            // console.log(res1);
                          })
                          .catch(errorMessage => {
                            console.log(errorMessage);
                          });
                      },
                      errorMessage => {
                        console.log(errorMessage);
                        reject(errorMessage);
                      }
                    )
                    .catch(errorMessage => {
                      console.log(errorMessage);
                    });
                }
              }
            }
          });
        } else {
          let val = data[key];
          decrypt_promise(val, CIPHER_KEY)
            .then(
              res => {
                ReplaceWithCipher(data, key, res)
                  .then(
                    res1 => {
                      resolve(res1);
                    },
                    errorMessage => {
                      console.log(errorMessage);
                      reject(errorMessage);
                    }
                  )
                  .catch(errorMessage => {
                    console.log(errorMessage);
                  });
              },
              errorMessage => {
                console.log(errorMessage);
                reject(errorMessage);
              }
            )
            .catch(errorMessage => {
              console.log(errorMessage);
            });
        }
      }
    }
    resolve(data);
  });
};

let data = {
  $class: "org.example.basic.PatientData",
  EHR_ID: "3893",
  TreatmentDetails: [
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName:
        "U2FsdGVkX1+rR84cMrvvlLy2m3EkzpAlwlScUtuA1PXxlnEcSDINpxoScVG8u+jnpK4A4ItawDU5YMmunrTocroXVuOi9nsMDDLzBoWjbk+d/vxsMuWsDWYZb+HPcjaVV9SZBzUjGB8TQiGPca05oA==",
      StaffId:
        "U2FsdGVkX18/WLzyZUOslpe2lGPNxzxbrdhqRCKipoWDJ5g0+z7UvDHoTOKYTJbAFaUY0BdyUoLOlAw7QdM95zpUW3j7ozTX/53A7ba9lp+54KmK9HGBZCxohm1hCj6E7z8VUbxZP7AHhxIadjy/7Q==",
      PinCode:
        "U2FsdGVkX19BScENuOa6ox10W4zFyI/b+93JlYUtmqP4EIOBuzhQVPpMBrJiYsCeB7c9lnQBZ3iwzR5c4//aNInyGTfkz/7XkV+VSXp3EUSHvN3fqnQtfj9QiJHLcbx+aaKUUHfUCkoHyKsOUwxuSg==",
      ChronicDisease:
        "U2FsdGVkX19TyeyrZcvWSYfLHz3FBi3XllqX1Y5SgQbBS5WrggCkkYbL7dD9pp8TldhEaQbMxHXn4tyysdtEX8SJdlquBVZOAiJiy5keU4KcXFJed5GxOh2WkdJgr1pXtN5TRYZy67krDb47OXVXIw==",
      Disease:
        "U2FsdGVkX19uSieOPcRRJffMuvMyNynfvvjNFQuMQ7mJOvF/cdM4GqNpMjaTLWAXyHh+ohIkAHI6AFXDnFlHUkhkz0onEUlaN+JhSrSOmqyYgOjCLmfNo6uK44E1bNSJdJcQKH/o7i4s5VLZSfdMLQ==",
      DiseaseType:
        "U2FsdGVkX18yKpFKx4RlI/1pL4eDGWyCyytILdxrXUce95btCXkFdP8fcPfnlYIskaKZNBB01rKs1bht9Tyw9N8pgTRPK2GWizV5Sx0rkaX7UqMNYVXlmJfs3s9GTZwZLXIdYiVb8MRMmOYtiLIfVRnzTrw2uaENVM+k1c93AFZWwt/D3cHc6X2AT3/xGe+rynwq+iZKSWlU9FxxlYX14A==",
      DiseaseCategory:
        "U2FsdGVkX19O8/oaWsW86x9lMYI63z2TTo227bScQsgVCxc2XeDm84sbEiWV9A8VtOi43ix4kSVWjf10hcIIdCxYUOHJqhwxtzqjKv1PmgN4b0hbgicc+pTb/XEd3dQxIzCXz1d/Ehun5PVVfAYjJA==",
      DiseaseSubCategory:
        "U2FsdGVkX19sO5c9mqL0TNens1L+R1YBQg3KfYoJDUilptFIpb/YPPdJEheeuP2LkcXY3KBc+EX4wWvSQcj7Nqpu2CI0VlTImhTwuLXTYgXZQFIBUQWVPGKz+dzf4f0hDqYiRiVUUN93pzP6zZMmkA==",
      symptom:
        "U2FsdGVkX1+g9pmMwbjMwaBv6auP8gxN1J7TBOv+ZSczbuXGpOvbSZPxWG4GPk7FTwUcee4U4Iyth2W1Od2JJD/Kqj3BZ5DB4isscZerS0Hv27BKcRdwdAOFTy5BOo9yobhPzsAscF19vYVtgxHyZCf+VZymiSnWXNPs47ZRyJQAT7wPL0bMV34P1vQnbYB1ZZ9WKTbQY3uoGwR+UvF8fQ==",
      allergies:
        "U2FsdGVkX1/QSiZXorJwnYuFt27VafOA47eIsY2pbIT2znh0jekiZ97nOjJsAYYbGdlMY0EQ29GSYaOc6LQNlOzUdYhY8G75rKh0f4g7zAM8hJop+hsYtQmJaYg6CMaX6DpJXZxfrYyyBkn9taythw==",
      AlcoholConsumption:
        "U2FsdGVkX19wPAaiphBl1+/k5CXSNqJH0zlPYmS3qRgJjAu+kKkKtoSeG9ng1RkSaE1oaPgbDNtdihPj7Hdp3ZoBaQuoMO5vtzPTPtDcG6HnFGWzqH8XjT9e7n1zHIkcDgWXicE+jG9dUuHosfmwtw==",
      SmokingHabits:
        "U2FsdGVkX19vlB0qZWTv0QCHpBpACXGRqUq4dQMt0uPgN37R+P3Jta2F/S6TgkKYgufxJGnA0de0HW6NPuZWMY8D/vWFVt2yMmMtj3d8wxCA7shpXSNxGPqvUfk3pLsCj62/z/RYaU4gIT0rig2Jew==",
      medicines:
        "U2FsdGVkX1833Ss/T724diSDTa9SOELe8Tw1qAv+tsrUcWfhSXPVU8FNt0lPpMEZhzApccx9y5SZRbzEYeqeGipPl9/fdW8BifzkG+hYGiOzuOmvqMQzh1l88B3SBJPY+mdyIjOXzrK6KmfMaQ6nBg==",
      tests:
        "U2FsdGVkX19WxnT1tcrAez3ejoW/bF0LPrMaOnoMRRHdK2hha2Qe1ZhmHMHjPNk5pFR1IXrA2m1rYku6mxWaDy/npkyaifWnJTb/XB9d2VXK3ifoBz42ufPkyU9eMc3TSDZkiXqXY204pl8ePUg4Og==",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "8bae36a0f185904aaf894922360672698e20b6523ad9b8a51aa3eb5f77e7966d",
      timestamp: "2018-10-01T16:59:30.765Z"
    },
    {
      $class: "org.example.basic.TreatmentDetails",
      HospitalName:
        "U2FsdGVkX1+tRJHQbTfoCsFgBtj8Zm+DnNRK9AdFIeOnCJUkZ7ogqg1wmwFe1Sob+Y1Ws2dzQ2lOp4NXMb7P7rXmupoaWLnfMrGg3LaC79gT+fpEAm9QEdFhVEH/Un/Yj4wKMwpl1go6EG0hjSaugQ==",
      StaffId:
        "U2FsdGVkX19E2u/NQTtJeQXKRoFcYesLZ87JcLPIql0l+lOzHXdZn3DpKmRlZtTySHXgk0uuid3uMzWqaqpj1rJ6NzfMf284G9dPkC6k4SYbBNJtx+a+chimAKVwLb5/ufKNpDjlDmTznCzC8qfGQA==",
      PinCode:
        "U2FsdGVkX1+tTwtb0F1IS35eAB/9j2iOs24RxIrW+imi70IbBti0UyBymlpxXDvhQd9gngH0vWHd5Yng5UXyhEJF2ScV+blYl8Tc8EJYLAT/DmTBeRYm9Am90vV6QZRusaK2kQvaYAE3MnjrRIQvuw==",
      ChronicDisease:
        "U2FsdGVkX18yv+0yM2Oi2vWFoJWZILhd2lZVSqR6qh2G/MqmmcKVbaeGGIqAzkOjNimOk5t8XfkxtOtWYak9JOTl7/rycp/Qs5MSaAhvznyp0ceBIoENUH7yRm14pODZUNESzjGUAvLl2QA6ZuTEKA==",
      Disease:
        "U2FsdGVkX1+tUgqqTh0PB1eREqBGuF6UXoGjd3hMrkpuMRJXAElQ1SfdTVnyPBxgPJiJafsbwE9RxNElrTr/oIJ03ijPMxy6b12/uJuFbkZa+kzXkSHfmSS8Mgvt+lWd72DXLsMwTG7CkQLpkgLwiA==",
      DiseaseType:
        "U2FsdGVkX19s30LmwE6gYu7JWaka/w8QqXnaCV7mPQAbmZlkPL6edeQIOLRi1b/espZajdO6SGEWp5yVvGq5hP3m6GOt+X34i5JBnuVFWU8xHMrkop/P+gv6mQZChCKXmkqZKR/oV4MVDFPCZ/Eerf+xDCIcbCR5J7++jZaYpPL+ddOzZL9NsYAvQ15/tIbipkAwn/mmpC1Gr4sfvwCHPw==",
      DiseaseCategory:
        "U2FsdGVkX19ZU9O0PnlDE969fWRbenJN+9/D8YLfqKWGn5KnXuJoKhbEkiHlEEuENEJ2ccxjMw2dYaadifIYZvmgK0OUjwLyOnmdZ5xk6MmYEfrjRPO8bDMNvNtaAGFU2GkejcsYRGfK0rEzaoTRrA==",
      DiseaseSubCategory:
        "U2FsdGVkX1+deluBMgDp/GBwvFtm31ghcqBQ0FRaEOdKaqoMsrJR60HMN6yBZcLOW8MwnDSq0Rc7B8Y1BdoGPr0Zs75f+FNjHPbIObBy5i8iUNG/Pu5pUWkzB4TaOCuVDyC4gftkYDErSh3heTc/oQ==",
      symptom:
        "U2FsdGVkX19TBL8JkupjsByHWCYMnLFjKcNuH0cmKqXvee7cwrnPH6M5tr2Utisna/4c0lwGJta1HEwmbXAYlM7BjbLOu5Y/ZJhIwwImp1Q+bbaAVHjhDyKsIHMkrDWTNnqvqobzqubAYrzpWydoaIZOrIWmntzK1mFXbwfZbGgOaHNr7GJvsUuSKJfCW5MzUd37hyr5rDc/LYboG5ePSg==",
      allergies:
        "U2FsdGVkX18645PhmF4Ouxt7z1MhL4lwio4SPDmyDU9HMY3HJMx4lAcV2ZwW7MrXSmso/ytxnrm/Eu1Cf7DJtyTg8AWq1r4EQdLUcgOi2Si0j/EtjrWylMfZwrP7WBRRmq721rA/RS2E0FR0LTCX0g==",
      AlcoholConsumption:
        "U2FsdGVkX1+7kEsaMzoSUmxawIXMg82bi6R0r83HWYwqC6ZOgY4wSNgiPzz0WxhwFt7VB+Kd73k1Q1uDQJQzu8G0ATfOfPdUrTZeqHP2PYvbdREVop0LOLvWI5/YkjeXylXg1i3GEzDHFIKlsthw/Q==",
      SmokingHabits:
        "U2FsdGVkX19CS0Jcpc+7F1WKJKP8xR0VDOM97p8B3Qn1883CcByTCUNvue2Xtrl2mWn5Bzskg6NquL8fZ1EHxDfiXbrZBe+cluBFN5D4qakZg//yxATejSuhCuBlQ5OEXb4paM54vgk+CTQO0BaLjA==",
      medicines:
        "U2FsdGVkX1+UHVK2mpcWTY17H+9rXwZcrjgE9iEw+jSENcK8DtD8icc5H7mvYQHridkohDLW/FI3nsRQXJwVJ7vocZ1wdj/N1ZWf0Cn0DzSTIsLqmNJZIrL25HVGtASu5KGZrlG+bcDJ73FXafMxNA==",
      tests:
        "U2FsdGVkX181YOitPY/U3XzF9UkgBcx1XjQOp1iqPzKYc29PWrrpI3ihrc8rLtxnjWY7dWd2mWmqUS/HzDn3n2kYmQzwO+03tZ/EeWgGMxvFk19Kd1OGzQbSPUInt1XgSUBlmyezR/1Keg6QP/w6GA==",
      patientData: "resource:org.example.basic.PatientData#1337",
      transactionId:
        "b27e079867530d8b0cd2f4c4fdced8d8f6a214cf1a8a26af0f8e60ebe96ff91b",
      timestamp: "2018-10-01T17:24:17.543Z"
    }
  ]
};

// decrypt_patientData(data, "12345").then(doc => {
//   console.log(doc);
// });

module.exports = {
  decrypt_patientData //it works
};
