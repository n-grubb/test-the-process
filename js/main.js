// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCNIVMndmMhKXNis9BxtgHELQj1JEAdou0',
  authDomain: 'fb-tryout.firebaseapp.com',
  databaseURL: 'https://fb-tryout.firebaseio.com',
  projectId: 'fb-tryout',
  storageBucket: 'fb-tryout.appspot.com',
  messagingSenderId: '959488797606'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

$(function() {
  $('.check').change(strikeThruRow);

  $('tbody').sortable({
    update: function(event, ui) {
      updateRankings();
    }
  });

  function strikeThruRow() {
    if (this.checked) {
      $(this)
        .parent()
        .parent()
        .addClass('strikethru');
    } else {
      $(this)
        .parent()
        .parent()
        .removeClass('strikethru');
    }
  }

  function updateRankings() {
    var players = null;
    var rank = 0;
    $('#rankings > tbody  > tr').each(function() {
      rank += 1;
      $(this)
        .children('.rank')
        .text(rank);
      let avg = $(this)
        .children('.rank-avg')
        .text();
      let diff = parseFloat(avg) - rank;

      prefix = '';
      d_class = '';
      if (diff > 0) {
        prefix = '+';
        d_class = 'positive';
      } else if (diff < 0) {
        d_class = 'negative';
      }

      $(this)
        .children('.rank-diff')
        .removeClass('positive')
        .removeClass('negative');

      $(this)
        .children('.rank-diff')
        .text(prefix + diff)
        .addClass(d_class);

      /* debug:
      console.log(
        $(this)
          .children('.name')
          .text()
      );
      console.log('avg: ' + parseFloat(avg));
      console.log('rank: ' + rank);
      console.log('new diff: ' + diff);
      */
    });
    players = createJSONData();
    saveToFirebase(players);
  }

  function createJSONData() {
    /* pitcher fields:
    'K': ,
    'W': ,
    'ERA': ,
    'WHIP': ,
    'SVHD': ,
    */

    var players = new Array();
    $('#rankings > tbody  > tr').each(function() {
      var player = {
        rank: $(this)
          .children('.rank')
          .text(),
        name: $(this)
          .children('.name')
          .text(),
        pos: $(this)
          .children('.pos')
          .text(),
        playerid: $(this).data('player'),
        R: $(this)
          .children('.runs')
          .text(),
        HR: $(this)
          .children('.hrs')
          .text(),
        RBI: $(this)
          .children('.rbis')
          .text(),
        SB: $(this)
          .children('.sbs')
          .text(),
        OBP: $(this)
          .children('.obp')
          .text(),
        ADP: $(this)
          .children('.rank-adp')
          .text(),
        ESPN: $(this)
          .children('.rank-espn')
          .text(),
        AVG: $(this)
          .children('.rank-avg')
          .text(),
        DIFF: $(this)
          .children('.rank-diff')
          .text()
      };
      players.push(player);
    });

    console.log(players);
    return players;
  }

  function saveToFirebase(players) {
    if (!players) {
      return;
    }
    console.log('saving data...');

    $.each(players, function(index, player) {
      database.ref('players/' + player.playerid).set({
        rank: player.rank,
        name: player.name,
        pos: player.pos,
        R: player.R,
        HR: player.HR,
        RBI: player.RBI,
        SB: player.SB,
        OBP: player.OBP,
        ADP: player.ADP,
        ESPN: player.ESPN,
        AVG: player.AVG,
        DIFF: player.DIFF
      });
    });
  }

  /*
  function saveToJSONFile(){
    var a = document.createElement('a');
    a.setAttribute('href','data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify({$('#tt').html()}));
    a.setAttribute('download', "data.json");
  }
  */
});
