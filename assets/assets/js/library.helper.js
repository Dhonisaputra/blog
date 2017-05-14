/*
|------------------------------------------------
| Jquery can search element by pattern of their attribute.
|------------------------------------------------
|
|$('elm:attrNameStart(ng)')
*/
$.extend($.expr[':'],{
    attrNameStart: function(el,i,props) {

        var hasAttribute = false;

        $.each( el.attributes, function(i,attr) {
            if( attr.name.indexOf( props[3] ) !== -1 ) {
                hasAttribute = true;
                return false;  // to halt the iteration
            }
        });

        return hasAttribute;
    }
})

/*
|------------------------------------------------
| add prototype array diff into Array object.
|------------------------------------------------
*/
Array.prototype.diff = function(arr2) {
    var ret = [];
    for(var i in this) {   
        if(arr2.indexOf( this[i] ) > -1){
            ret.push( this[i] );
        }
    }
    return ret;
};
// -----------------------------------------------

/*
|------------------------------------------------
| add prototype array remove into Array object.
|------------------------------------------------
*/
Array.prototype.remove = function(index) {
    this.splice(index,1)
};
// -----------------------------------------------

/*
|------------------------------------------------
| Create uniqueid based on time.
|------------------------------------------------
*/
function unique_id()
{
   var uniq = new Date().valueOf();
   return uniq;
}
// ----------------------------------------------

/*
|------------------------------------------------
| Execution function by name.
|------------------------------------------------
|
| executeFunctionByName('helloWorld', window);
*/
function executeFunctionByName(functionName, context /*, args */ ) {

    var args = [].slice.call(arguments).splice(2),
        namespaces = functionName.split("."),
        func = namespaces.pop();
    
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    
    return context[func].apply(this, args);
}
// ----------------------------------------------

/*
|------------------------------------------------
| Remove item in an array.
|------------------------------------------------
|
| var a = [a,b,c,d,e]
| removeArray(a, )
*/
function removeArray(array, index)
{
    array.splice(index,1)
}
    
/*
|------------------------------------------------
| Set pop up will appears at center of screen.
|------------------------------------------------
|
| popUpCenter('http://www.google.com', 'Google', 100, 200, 'other,parameters', {}  )
*/
function popupCenter(url, title, w, h, other, data) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left+',scrollbars,'+other);

    if(data)
    {
        var form = '<form method="post" action="" target="TheWindow">';
    }
    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
    return newWindow;
}

/*
|------------------------------------------------
| Class Sort arrays.
|------------------------------------------------
|
|   var a = [{alphabet:'c'},{alphabet:'a'},{alphabet:'e'}]
|   var b = [2,1,3,4,5,6]
|   var s = new sortBy(b,'-'); // [6,5,4,3,2,1]
|   var s = new sortBy(b); // [1,2,3,4,5,6]
|   var s = new sortBy(a,'alphabet', 's'); // [{alphabet:'a'},{alphabet:'c'},{alphabet:'e'}]
|   var s = new sortBy(a,'-alphabet', 's'); // [{alphabet:'e'},{alphabet:'c'},{alphabet:'a'}]
*/
function sortBy(objs, prop, typeProp)
{
    this.property   = '';
    this.type       = 's';
    this.sortOrder  = 1;
    function set_sort_property(prop){
        if(prop[0] === "-") {
            this.sortOrder = -1;
            prop = prop.substr(1);
        }
        this.property = prop;
    }
    function get_sort_property(){return this.property;}
    function set_sort_type(settype){this.type = settype? settype : 's';}
    function get_sort_type(){return this.type;}

    function compare(a,b) {
        var sortOrder = 1;
        var prop = get_sort_property()
        if(prop.length > 0 )
        {
            switch(get_sort_type())
            {
                case 'i':
                    a[prop] = parseInt(a[prop]);       
                    b[prop] = parseInt(b[prop]);       
                    break;
                case 'b':
                    a[prop] = JSON.parse(a[prop]);       
                    b[prop] = JSON.parse(b[prop]);
                    break;
                case 's':
                default:
                    a[prop] = String(a[prop]);       
                    b[prop] = String(b[prop]);  
                    break;
            }
            var result = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
        }else{
            switch(get_sort_type())
            {
                case 'i':
                    a = parseInt(a);       
                    b = parseInt(b);       
                    break;
                case 'b':
                    a = JSON.parse(a);       
                    b = JSON.parse(b);
                    break;
                case 's':
                default:
                    a = String(a);       
                    b = String(b);
                    break;
            }
            var result = (a < b) ? -1 : (a > b) ? 1 : 0;
        }
        return result*sortOrder;
    }
    if(prop) set_sort_property(prop);
    if(typeProp) set_sort_type(typeProp);
    this.sortObj = objs.sort(compare);
    return this.sortObj;

}
// -----------------------------------------------------------------

/*
|------------------------------------------------
| Copy text from textarea / string direct copy.
|------------------------------------------------
|
| copy('textarea', callback())
| copy('lorem ipsum dor amet...', callback())
*/
function copy()
{
    var params = arguments;
    var paramsLength = arguments.length;
    var e = params[0];
    var c = params[paramsLength-1];
    if($(e).length < 1)
    {
        var uniqueid = unique_id();
        var textareaId = "__temp_textarea__"+uniqueid;
        var element = $("<textarea id='"+textareaId+"'></textarea>");
        element.appendTo('body')
        .each(function(){
            $(this).val(e)
            $(this).select()
        })
    }else
    {
        $(e).select();
    }

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text was ' + msg);
            if($(e).length < 1)
            {
                $(this).remove();
            }
            if(typeof c == 'function')
            {
                c()
            }
        } catch (err) {
            console.error('Oops, unable to copy');
        }
}
// -----------------------------------------------------------------

/*
|------------------------------------------------
| Check if the passed str is JSON string or not.
|------------------------------------------------
|
| isJSON('foo') // false
| isJSON('{"json":true}') // true
*/
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
// -----------------------------------------------------------------
