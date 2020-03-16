        // firebase config
        const config = {
            apiKey: "AIzaSyCkcPEp0y0d6KMRdwIH2HauZ6AyXkkPKz4",
			authDomain: "hiphop-prizes-6134e.firebaseapp.com",
			databaseURL: "https://hiphop-prizes-6134e.firebaseio.com",
			projectId: "hiphop-prizes-6134e",
			storageBucket: "hiphop-prizes-6134e.appspot.com",
			messagingSenderId: "1057756040240",
			appId: "1:1057756040240:web:458a4808e51b83b7"
        };
        firebase.initializeApp(config);

        const storage = firebase.storage();
        // Create a storage reference from our storage service
        const storageRef = storage.ref();
        
        // Create a child reference
        const imagesRef = storageRef.child('images');
        // imagesRef now points to 'images'
        // Create a ref to a file - space.jpg
        var fileName = '';
        var curFile;
        $('input[type="file"]').change(function(e){

            $('#img').show();
            fileName = e.target.files[0].name;
            curFile = e.target.files[0];
            readURL(this);

        });    

        function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#img').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
          }
       }



        $('#login_form').on('submit', function(evt)
        {
                evt.preventDefault();
                var email = $('#email').val().trim();
                var password = $('#password').val().trim();
                firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
                     window.location.href = "index.html";
                  //Here if you want you can sign in the user
                }).catch(function (error) {
                    // Handle Errors here.
                    //var errorCode = error.code;
                    var errorMessage = error.message;
                    toastr.error(errorMessage);
                });
        });

        
        $('#btn-add').on('click', function(evt)
        {
            window.location.href = "create.html";
        });

        $('#btn-add-event').on('click', function(evt)
        {
            window.location.href = "create_event.html";
        });

        function deleteRow(key, item)
        {
            if (key) {
                var Entry = firebase.database().ref('Prizes').child(key);
                if(confirm('This entry will be permanently delete. Are you sure?')){
                    
                    Entry.once('value', function (r) {
                        var entry = r.val();
                        if(entry.image)
                        {
                            var desertRef = storageRef.child('images/'+ entry.image);
                            //imagesRef.child(entry.image);
                            desertRef.delete().then(function() {
                                
                                Entry.remove(); // this will trigger Entry.on('value') immediatly
                                $(item).parents("tr").remove();
                                return false;
                              // File deleted successfully
                            }).catch(function(error) {
                                return false;
                              // Uh-oh, an error occurred!
                            });
                        }
                    });
                    Entry.remove(); // this will trigger Entry.on('value') immediatly
                    $(item).parents("tr").remove();
                }
            }
        }

        function deleteEvtRow(key, item)
        {
            if (key) {
                var Entry = firebase.database().ref('Event').child(key);
                if(confirm('This entry will be permanently delete. Are you sure?')){
                    Entry.remove(); // this will trigger Entry.on('value') immediatly
                    $(item).parents("tr").remove();
                }
            }   
        }

        function deleteQuizRow(key, parentkey, item)
        {
            if (key) {
                var Entry = firebase.database().ref('Event/' + parentkey + '/Quiz/' + key);
                if(confirm('This entry will be permanently delete. Are you sure?')){
                    Entry.remove(); // this will trigger Entry.on('value') immediatly
                    $(item).parents("tr").remove();
                }
            }      
        }

        function deleteData(key)
        {
            if (key) {
                var Entry = firebase.database().ref('Prizes').child(key);
                if(confirm('This entry will be permanently delete. Are you sure?')){
                    
                    Entry.once('value', function (r) {
                        var entry = r.val();
                        if(entry.image)
                        {
                            var desertRef = storageRef.child('images/'+ entry.image);
                            //imagesRef.child(entry.image);
                            desertRef.delete().then(function() {
                                
                                Entry.remove().then(function()
                                {
                                    window.location.href = 'index.html';
                                    return false;        
                                }); 
                                
                              // File deleted successfully
                            }).catch(function(error) {
                                return false;
                              // Uh-oh, an error occurred!
                            });
                        }
                    });
                    Entry.remove().then(function(){
                        window.location.href = 'index.html';
                    }); // this will trigger Entry.on('value') immediatly

                }
            }
       }

        function deleteImage(filename)
        {
             var desertRef = storageRef.child('images/'+ filename);
            //imagesRef.child(entry.image);
            desertRef.delete().then(function() {
                
             // File deleted successfully
            }).catch(function(error) {
              // Uh-oh, an error occurred!
            });
        }

        /*************\
         * Utilities *
        \*************/

        function $_GET(key) {
            var queries = window.location.href.split('?').pop().split('&');
            var params = {};
            queries.map(function (query) {
                var set = query.split('=');
                params[set[0]] = set[1];
            });

            if (key) {
                return params[key] || null;
            } else {
                return params;
            }

        }

        function pad2Digit(num) {
            return ('0' + num.toString()).slice(-2);
        }

        function datetimeFormat(timestamp) {
            var dateObj = new Date(timestamp);
            var en_month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return dateObj.getDate() + ' ' + en_month[dateObj.getMonth()] + ' ' + pad2Digit(dateObj.getFullYear()) + ' ' + pad2Digit(dateObj.getHours()) + ':' + pad2Digit(dateObj.getMinutes());
        }

        function strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function excerpt(text, length) {
            text = strip(text);
            text = $.trim(text); //trim whitespace
            if (text.length > length) {
                text = text.substring(0, length - 3) + '...';
            }
            return text;
        }
