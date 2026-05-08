
MathJax = {
  chapter: 1,
  tex: {
    tags: 'ams',
    packages: {'[+]': ['tagformat', 'chapters']},
    tagformat: {
      number: (n) => {
        const s = window.MathJax.config.chapter;
        
        // Logic: If section is 13 or higher, start A, B, C
        if (s > 5) {
          // 6 becomes 1 (A), 14 becomes 2 (B), etc.
          const appendixNum = s - 5; 
          const letter = String.fromCharCode(64 + appendixNum);
          return letter + '.' + n;
        }
        
        // Otherwise, standard 1.1, 2.1... 12.1
        return s + '.' + n;
      },
      id: (tag) => 'eqn-id:' + tag
    },
    preFilters: [
      ({math}) => {
        if (math.inputData.recompile) {
          MathJax.config.chapter = math.inputData.recompile.chapter;
        }
      }
    ],
    postFilters: [
      ({math}) => {
        if (math.inputData.recompile) {
          math.inputData.recompile.chapter = MathJax.config.chapter;
        }
      }
    ]
  },
  loader: {load: ['[tex]/tagformat']},
  startup: {
    ready() {
      const Configuration = MathJax._.input.tex.Configuration.Configuration;
      const CommandMap = MathJax._.input.tex.TokenMap.CommandMap;
      new CommandMap('chapters', {
        nextChapter(parser, name) {
          MathJax.config.chapter++;
          parser.tags.counter = parser.tags.allCounter = 0;
        },
        setChapter(parser, name) {
          const n = parser.GetArgument(name);
          MathJax.config.chapter = parseInt(n);
        }
      });
      Configuration.create(
        'chapters', {handler: {macro: ['chapters']}}
      );
      MathJax.startup.defaultReady();
    }
  }
};