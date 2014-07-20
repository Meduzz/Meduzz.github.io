$(function(){
  $("#itemsTmpl").tmpl().appendTo("#page");

  var ItemsView = Backbone.View.extend({
    el:"#page",
    render:function() {
      $("#main").empty();
      renderItems(ds);
    },
    renderLetter:function(letter) {
      $("#main").empty();
      renderItems(getForLetter(letter));
    },
    renderTag:function(tag) {
      $("#main").empty();
      renderItems(getForTag(tag));
    }
  });

  var Router = Backbone.Router.extend({
    routes: {
      "":"start",
      "l/:letter":"byLetter",
      "t/:tag":"byTag",
      "all":"start"
    },
    start:function() {
      var itemsView = new ItemsView();
      itemsView.render();
    },
    byLetter:function(letter) {
      var itemsView = new ItemsView();
      itemsView.renderLetter(letter);
    },
    byTag:function(tag) {
      var itemsView = new ItemsView();
      itemsView.renderTag(tag);
    }
  });
  
  var ds = [];
  $.getJSON("data.json", function(data){
    ds = data;
    var router = new Router();
    Backbone.history.start();

    $(getAlphas()).each(function(i, alpha) {
      $("#listItemTmpl").tmpl({item:alpha, type:"l"}).appendTo("#alphas");
    });
    var tags = getTags();
    for (var i in tags) {
      $("#tagTmpl").tmpl({item:i, weight:tags[i], type:"t"}).appendTo("#tags");
    }
  });

  function getAlphas() {
    var alphas = [];
    
    $(ds).each(function(idx, item) {
      var letter = item.name.substring(0,1).toUpperCase();
      if (alphas.indexOf(letter) === -1)
        alphas.push(letter);
    });

    return alphas.sort();
  }
  
  function getTags() {
    var tags = {};
    
    $(ds).each(function(idx, item) {
      $(item.tags).each(function(k, v) {
        if (tags[v]) {
          tags[v]++;
        } else {
          tags[v] = 1;
        }
      });
    });
    
    var med = 0;
    var count = 0;
    var max = 0;
    var min = 99999;
    
    for (var tag in tags) {
      var c = tags[tag];
      med += c;
      
      if (c > max)
        max = c;
      
      if (c < min)
        min = c;
      
      count++;
    }

    med = Math.round(med/count);
    var fifth = max*0.2;
    
    for (var tag in tags) {
      var c = tags[tag];
      
      var i = 1;

      while (i < 6) {
        if (c > i*fifth) {
          tags[tag] = i;
        }
        i++;
      }
    }
    
    return tags;
  }
  
  function getForLetter(letter) {
    var items = [];
    
    $(ds).each(function(i, item) {
      if (item.name.substring(0,1).toUpperCase() === letter) {
        items.push(item);
      }
    });
    
    return items;
  }
  
  function getForTag(tag) {
    var items = [];
    
    $(ds).each(function(i, item) {
      if (item.tags.indexOf(tag) !== -1) {
        items.push(item);
      }
    });
    
    return items;
  }
  
  function renderItems(items) {
    $(items).each(function(i, item) {
      $("#itemTmpl").tmpl(item).appendTo("#main");
    });
  }
});
