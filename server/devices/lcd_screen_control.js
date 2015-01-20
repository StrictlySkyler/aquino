
Meteor.publish('LCDScreenControl', function () {
  return LCDScreenControl.find();
});

Meteor.methods({

  'lcd:setText': function (options) {

    function goHome (callback) {
      rasp2c.set(address, command, home, mode, callback);
    }

    function clearScreen (callback) {
      rasp2c.set(address, command, clear, mode, callback);
    }

    function writeText (callback) {
      rasp2c.set(address, asciiCode.join(' '), mode, callback);
    }

    var async = Meteor.npmRequire('async');
    var mode = 'i';
    var address = 0x28;

    var command = 0xfe;
    var clear = 0x51;
    var home = 0x46;
    var CHARACTERS = {
      ' ':32,'!':33,'"':34,'#':35,'$':36,'%':37,'&':38,"'":39, '(':40,')':41,
      '*':42,'+':43,',':44,'-':45,'.':46,'/':47, '0':48,'1':49,'2':50,'3':51,
      '4':52,'5':53,'6':54,'7':55,'8':56,'9':57,':':58,';':59,'<':60,'=':61,
      '>':62,'?':63, '@':64,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,
      'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,
      'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'[':91,
      ']':93,'^':94,'_':95,'`':96,'a':97,'b':98,'c':99,'d':100,'e':101,'f':102,
      'g':103,'h':104,'i':105,'j':106,'k':107,'l':108,'m':109,'n':110,'o':111,
      'p':112,'q':113,'r':114,'s':115,'t':116,'u':117,'v':118,'w':119,'x':120,
      'y':121,'z':122,'{':123,'|':124, '}':125,'~':126
    };

    var asciiCode = [];

    for (var i = 0; i < options.data.text.length; i++) {
      asciiCode.push(CHARACTERS[options.data.text[i]]);
    }

    async.series(
      [goHome, clearScreen, writeText],
      Meteor.bindEnvironment(function saveData (error) {
        if (error) { throw error; }

        LCDScreenControl.upsert(options.id, options.data);
    }));

  }
});
