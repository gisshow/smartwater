(function () {
    var r = new RegExp("(^|(.*?\\/))(include-leaflet\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    function supportES6() {
        var code = "'use strict'; class Foo {}; class Bar extends Foo {};";
        try {
            (new Function(code))();
        } catch (err) {
            return false;
        }
        if (!Array.from) {
            return false;
        }
        return true;
    }

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        var excludes = (targetScript.getAttribute('exclude') || "").split(",");
        if (!inArray(excludes, 'leaflet')) {
            inputCSS("./static/dist/leaflet/leaflet.css");
            inputScript("./static/dist/leaflet/leaflet.js");
               
        }
        if (inArray(includes, 'mapv')) {
            inputScript("http://mapv.baidu.com/build/mapv.min.js");
           // inputScript("./static/dist/leaflet/mapv.min.js");
        }
        if (inArray(includes, 'turf')) {
          //  inputScript("https://cdn.bootcss.com/Turf.js/5.1.6/turf.js");
            inputScript("./static/dist/leaflet/turf.js");
        }
        if (inArray(includes, 'echarts')) {
              inputScript("https://cdn.bootcss.com/echarts/4.1.0/echarts.min.js");
             // inputScript("./static/dist/leaflet/echarts.min.js");
        }
        if (inArray(includes, 'd3')) {
            inputScript("http://iclient.supermap.io/web/libs/d3/5.5.0/d3.min.js");
            //inputScript("./static/dist/leaflet/d3.min.js");
        }
        if (inArray(includes, 'd3-hexbin')) {
             //  inputScript("./static/dist/leaflet/d3-hexbin.v0.2.min.js");
            inputScript("https://d3js.org/d3-hexbin.v0.2.min.js");
        }
        if (inArray(includes, 'd3Layer')) {
              //inputScript("./static/dist/leaflet/leaflet-d3Layer.min.js");
            inputScript("http://iclient.supermap.io/libs/leaflet/plugins/leaflet.d3Layer/leaflet-d3Layer.min.js");
        }
        if (inArray(includes, 'elasticsearch')) {
              //inputScript("./static/dist/leaflet/elasticsearch.min.js");
            inputScript("http://cdn.bootcss.com/elasticsearch/15.0.0/elasticsearch.min.js");
        }
        if (inArray(includes, 'deck')) {
            //inputScript("./static/dist/leaflet/deck.gl.js");
            inputScript("http://iclient.supermap.io/web/libs/deck.gl/5.1.3/deck.gl.js");
        }
        if (!inArray(excludes, 'iclient9-leaflet')) {
            if (supportES6()) {
                //inputScript("./static/dist/leaflet/iclient9-leaflet-es6.min.js");
                inputScript("./static/dist/leaflet/iclient9-leaflet-es6.min.js");
            } else {
                //inputScript("./static/dist/leaflet/iclient9-leaflet.min.js");
                inputScript("./static/dist/leaflet/iclient9-leaflet.min.js");
            }
        }
        if (inArray(includes, 'iclient9-leaflet-css')) {
            inputCSS("./static/dist/leaflet/iclient9-leaflet.min.css");
        }
        if (inArray(includes, 'leaflet.heat')) {
           // inputScript("./static/dist/leaflet/leaflet-heat.js");
            inputScript("http://cdn.bootcss.com/leaflet.heat/0.2.0/leaflet-heat.js");
        }
        if (inArray(includes, 'osmbuildings')) {
           // inputScript("./static/dist/leaflet/OSMBuildings-Leaflet.js");
            inputScript("http://iclient.supermap.io/web/libs/osmbuildings/OSMBuildings-Leaflet.js");
        }
        if (inArray(includes, 'leaflet.markercluster')) {
                 inputScript("./static/dist/leaflet/MarkerCluster.Default.css");
                  inputScript("./static/dist/leaflet/MarkerCluster.css");
                  //inputScript("./static/dist/leaflet/leaflet.markercluster.css");

           // inputCSS("https://cdn.bootcss.com/leaflet.markercluster/1.3.0/MarkerCluster.Default.css");
            //inputCSS("https://cdn.bootcss.com/leaflet.markercluster/1.3.0/MarkerCluster.css");
            inputScript("https://cdn.bootcss.com/leaflet.markercluster/1.3.0/leaflet.markercluster.js");
        }
        if (inArray(includes, 'leaflet-icon-pulse')) {

            inputCSS("http://iclient.supermap.io/libs/leaflet/plugins/leaflet-icon-pulse/L.Icon.Pulse.css");
            inputScript("http://iclient.supermap.io/libs/leaflet/plugins/leaflet-icon-pulse/L.Icon.Pulse.js");
        }
        if (inArray(includes, 'leaflet.draw')) {

           // inputScript("./static/dist/leaflet/leaflet.draw.css");
inputCSS("http://iclient.supermap.io/web/libs/leaflet/plugins/leaflet.draw/1.0.2/leaflet.draw.css");
            inputScript("./static/dist/leaflet/leaflet.draw.js");
           // inputCSS("http://iclient.supermap.io/web/libs/leaflet/plugins/leaflet.draw/1.0.2/leaflet.draw.css");
          //  inputScript("http://cdn.bootcss.com/leaflet.draw/1.0.2/leaflet.draw.js");
        }
        if (inArray(includes, 'leaflet.pm')) {
            inputCSS("http://iclient.supermap.io/web/libs/leaflet/plugins/leaflet.pm/0.25.0/leaflet.pm.css");
            inputScript("http://iclient.supermap.io/web/libs/leaflet/plugins/leaflet.pm/0.25.0/leaflet.pm.min.js");
        }
        if (inArray(includes, 'leaflet.miniMap')) {
            inputCSS("http://iclient.supermap.io/web/libs/leaflet/plugins/leaflet-miniMap/3.6.1/dist/Control.MiniMap.min.css");
            inputScript("http://iclient.supermap.io/web/libs/leaflet/plugins/leaflet-miniMap/3.6.1/dist/Control.MiniMap.min.js");
        }
        if (inArray(includes, 'leaflet.sidebyside')) {
            inputScript("http://iclient.supermap.io/libs/leaflet/plugins/leaflet-side-by-side/leaflet-side-by-side.min.js");
        }
    }


    load();
    window.isLocal = false;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : document.location.protocol + "//" + document.location.host;
})();
