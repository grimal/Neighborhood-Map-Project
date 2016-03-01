function markerAnimation(e){e.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){e.setAnimation(null)},3e3)}function initMap(){for(var e=new google.maps.LatLng(41.074448,-73.541316),n=new google.maps.Map(document.getElementById("map"),{center:e,mapTypeId:google.maps.MapTypeId.ROADMAP,scrollwheel:!0,zoom:12,zoomControl:!0,styles:styleArray}),t=!1,o=!1,s=0;s<places.length;s++){var a=places[s],i=new google.maps.LatLng(a.address.lat,a.address.lng),r=new google.maps.Marker({title:places[s].name,position:i,number:s,animation:null,draggable:!1});google.maps.event.addListener(r,"click",function(e){return function(){var e=new google.maps.InfoWindow,s='<div id="content"><div id="siteNotice"></div><b>'+this.title+"</b> </div>";e.setOptions({content:s}),e.setContent(s),e.open(n,this),cur_infowindow={name:this.title,infowindow:e,marker:this},this.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png"),n.panTo(this.position),null!==this.getAnimation()?this.setAnimation(null):markerAnimation(this),t?(t.title===a.name?null!==this.getAnimation()?this.setAnimation(null):markerAnimation(this):(t.setIcon(""),o.close(),t.setAnimation(null),places[t.number].marker=t),this.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png"),n.panTo(this.position)):markerAnimation(this),t=this,o=e,selected=this.number,selectPlace(this.number)}}(r)),places[s].marker=r,r.setMap(n)}}function selectPlace(e){if(!skip){if(skip=!0,"number"==typeof e)e=places[e];else{var n=e.marker.number;google.maps.event.trigger(places[n].marker,"click")}currentName(e.name),currentDesc(e.description),showModel(!0),getYelp(e),getFS(e),skip=!1}}function nonce_generate(){return Math.floor(1e12*Math.random()).toString()}function localJsonpCallback(e){}function callStart(e){}function callComplete(e){}function getYelp(e){var n="GET",t="YsPDWGOo52SXK3U-FoNm6g",o="d4oiThmVyRCZrZR1o8phpOV4FjI",s="https://api.yelp.com/v2/search?",a="MyX8vDPrsgUCTH3qWMK4M3zp8oLuBkE2",i="Stamford, CT",r="IKtJiQ-P4Gk_arqDvP3buDE-Wio",l={term:e.name,location:i,oauth_consumer_key:t,oauth_token:a,oauth_nonce:nonce_generate(),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",callback:"localJsonpCallback"},c=oauthSignature.generate(n,s,l,o,r);l.oauth_signature=c;var u={type:n,url:s,data:l,cache:!0,dataType:"jsonp",timeout:5e3,complete:callComplete("Yelp"),beforeSend:callStart("Yelp")};$.getJSON(u).done(function(e){e.businesses.length>0?(showYelp(!0),showYelpNoResult(!1)):(showYelp(!1),showYelpNoResult(!0)),yelpResults.removeAll();for(var n=0;n<e.businesses.length;n++)yelpResults.push({name:e.businesses[n].name,url:e.businesses[n].url})}).fail(function(e){Helpers.handleError("Error encountered in communicating with Yelp.  Please check your internet connection and firewall settings.  If this issue persists, there may be difficulty in communicating with Yelp."),showYelp(!1),showYelpNoResult(!0)})}function getFS(e){var n="GET",t=["https://api.foursquare.com/v2/venues/search?client_id=","&client_secret=","&v=20130815&near=","&query="],o="ZUPJOALYACXTHW3ZLE2I0RF2IWBOLFQPORW5LBUFHL2KEFTA",s="S4M2PBBKJVQP3HM3SCKEZIIEJARLZ5ITP1KUKN4IXT03CXTM",a="Stamford, CT",i=t[0]+o+t[1]+s+t[2]+a+t[3]+e.name,r={url:i,type:n,cache:!0,dataType:"json",complete:callComplete("fs"),beforeSend:callStart("fs")};$.getJSON(r).done(function(e){if(e=e.response,e.venues.length>0){fsResults.removeAll(),showFS(!0),showFSnoresult(!1);for(var n=0;n<e.venues.length;n++)fsDetails(e.venues[n].id)}else showFS(!1),showFSnoresult(!0)}).fail(function(e){Helpers.handleError("Error encountered in communicating with Foursqure.  Please check your internet connection and firewall settings.  If this issue persists, there may be difficulty in communicating with Foursquare."),showFS(!1),showFSnoresult(!0)})}function fsDetails(e){var n="GET",t="https://api.foursquare.com/v2/venues/"+e,o="ZUPJOALYACXTHW3ZLE2I0RF2IWBOLFQPORW5LBUFHL2KEFTA",s="S4M2PBBKJVQP3HM3SCKEZIIEJARLZ5ITP1KUKN4IXT03CXTM",a="Stamford, CT",i={type:n,url:t+"?client_id="+o+"&client_secret="+s+"&v=20130815&near="+a};$.getJSON(i).done(function(e){self.fsResults.push({name:e.response.venue.name,url:e.response.venue.canonicalUrl})}).fail(function(e){Helpers.handleError("Error encountered in communicating with Foursquare.  Please check your internet connection and firewall settings.  If this issue persists, there may be difficulty in communicating with Foursquare.")})}function Result(e){"use strict";this.name=e.result,this.url=e.url}var Helpers={handleError:function(e){return"map"===e?alert("There was an error loading the Google Maps API.  Please check your connection."):alert(e)},logError:function(e){return console.log(e)}},ViewModel=function(){"use strict";var e=this;e.places=ko.observableArray(places),e.query=ko.observable(""),e.resultsFound=ko.pureComputed(function(){for(var n=0,t=0;t<e.places().length;t++)places[t]._destroy()===!1&&n++;return n}),e.placeNumber=ko.pureComputed(function(){return selected}),e.helpers=Helpers;for(var n=0;n<places.length;n++)availableTags.push(places[n].name);$("#search-input").autocomplete({source:availableTags}),$("#search-input").on("autocompleteselect",function(n,t){for(var o=0;o<availableTags.length;o++)t.item.value.toLowerCase()===availableTags[o].toLowerCase()&&selectPlace(e.places()[o])}),this.currentMarker=function(){return e.places()[e.currentPlace()]},this.search=function(n){e.places().forEach(function(e){e.name.toLowerCase().indexOf(n.toLowerCase())>=0?(e._destroy(!1),e.marker.setVisible(!0)):(e._destroy(!0),e.marker.setVisible(!1),cur_infowindow&&e.name===cur_infowindow.name&&(cur_infowindow.infowindow.close(),cur_infowindow.marker.setIcon(""),cur_infowindow=!1,showModel(!1)))})},this.openSite=function(e,n){"click"===n.type&&window.open(e,"_blank")},this.query.subscribe(e.search),$("#modal-place").on("shown.bs.modal",function(){var n=e.places()[selected].marker.getPosition().lat(),t=e.places()[selected].marker.getPosition().lng(),o=new google.maps.LatLng(n,t);new google.maps.StreetViewPanorama(document.getElementById("street-view"),{position:o,prob:{heading:24,pitch:18}})})};ko.applyBindings(new ViewModel);