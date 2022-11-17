(function($){'use strict';var autocompletion=function(element,options){this.$element=$(element);this.options=options;this.init();}
autocompletion.defaults={datasets:null,callback:null,debounceDelay:300,group:false,groupOrder:[],facets:{blacklist:[],whitelist:[],show:2,url:null,},itemGroup:'category',itemLabel:'value',template:{group:function(context){return $('<div>').html(String(context.label));},suggestion:function(context){return $('<div>').html(String(context.label));}},templateMerge:true,transform:_processSetData,collection:null,dataType:'json',alpha:'0.5',format:'extended',params:null,profile:'_default',program:'/s/suggest.json',show:10,sort:0,queryKey:'partial_query',queryVal:'%QUERY',length:3,horizontal:false,scrollable:false,logging:true,interactionLog:'/s/log',typeahead:{classNames:{},highlight:true,hint:false,events:{select:function(event,suggestion){_selectItem(suggestion,$(event.target));},afterselect:function(event,suggestion){if(suggestion.extra.action_t=='E')$(event.target).focus();}}},};autocompletion.prototype.init=function(){this.option(this.options);if(_isEnabled(this.options))this.initTypeahead();else this.destroy();}
autocompletion.prototype.destroy=function(){this.destroyTypeahead;this.$element=null;this.options={};}
autocompletion.prototype.option=function(key,val){if(arguments.length===0){return this.options;}var that=this,options=$.isObject(key)?key:{},parts;if($.isString(key)){if(arguments.length===1||!$.isDefinied(val)){return $.dataVals($.extend({},that.options),key);}options[key]=val;}for(var k in options)_setOption(k,options[k]);function _setOption(key,val){if(key==='datasets')that.options[key]=_mapOptions(that.options,val);if(key==='debug')_debug=val;if(key==='horizontal'&&val){that.setTypeaheadClass('menu','tt-horizontal');that.options.typeahead.events.render=function(event){_renderSetWidth(that.getTypeaheadMenu(),'tt-horizontal','tt-dataset');};}if(key==='scrollable'&&val)that.setTypeaheadClass('menu','tt-scrollable');}}
autocompletion.prototype.horizontal=function(val){return this.option('horizontal',val);}
autocompletion.prototype.scrollable=function(val){return this.option('scrollable',val);}
autocompletion.prototype.initTypeahead=function(){var that=this,data=[];$.each(that.options.datasets,function(name,set){data.push(_getSetData(set,name));});that.$element.typeahead({minLength:parseInt(that.options.length),hint:that.options.typeahead.hint,highlight:that.options.typeahead.highlight,classNames:that.options.typeahead.classNames},data);if(that.options.typeahead.events){$.each(that.options.typeahead.events,function(eventName,func){that.$element.on('typeahead:'+eventName,func);});}if(that.options.horizontal){var data=that.$element.data(),menu=that.getTypeaheadMenu();data.ttTypeahead._onDownKeyed=function(){_navCursorUD(40,menu,that.$element);};data.ttTypeahead._onUpKeyed=function(){_navCursorUD(38,menu,that.$element);}
var cols=menu.children('.tt-dataset');if(cols.size()>1){data.ttTypeahead._onLeftKeyed=function(){_navCursorLR(37,cols,that.$element);};data.ttTypeahead._onRightKeyed=function(){_navCursorLR(39,cols,that.$element);}}that.$element.on('keydown',function(event){var code=event.keyCode||event.which;if(code==38||code==40)return false;if((code==37||code==39)&&$.exist(_navCols.cursor))return false;});}if(!that.options.logging)return;that.$element.on('typeahead:select',function(event,suggestion){logInteraction(that.options,suggestion,$(event.target),'select');});}
autocompletion.prototype.destroyTypeahead=function(){this.$element.typeahead('destroy');}
autocompletion.prototype.getTypeaheadMenu=function(){return this.$element.siblings('.tt-menu');}
autocompletion.prototype.setTypeaheadClass=function(name,className){if(!$.exist(this.options.typeahead.classNames[name],true))this.options.typeahead.classNames[name]='tt-'+name;this.options.typeahead.classNames[name]+=' '+className;}
var _debug=false,_mapKeys=['collection','callback','dataType','alpha','facets','transform','format','group','groupOrder','itemGroup','itemLabel','params','profile','program','show','sort','queryKey','queryVal','template','templateMerge','debounceDelay'],_navCols={cursor:null,query:''};function _isEnabled(options){var bState=false;if(!$.isObject(options.datasets))return bState;$.each(options.datasets,function(name,set){if($.exist(set.collection,true))bState=true;});return bState;}function _mapOptions(options,datasets){var map={};$.each(_mapKeys,function(i,key){map[key]=options[key]});$.each(datasets,function(name,set){datasets[name]=$.extend(true,{},map,set)});return datasets;}function _getSetData(set,name){var engine=new Bloodhound({datumTokenizer:Bloodhound.tokenizers.obj.whitespace('value'),queryTokenizer:Bloodhound.tokenizers.whitespace,remote:getBloodhoundRemote()});engine.initialize();return{name:name,limit:10000,source:source,display:displayVal,templates:_renderSetTemplate(set)}
function displayVal(suggestion){return $.isFunction(set.itemLabel)?set.itemLabel.call(undefined,suggestion):$.dataVals(suggestion,set.itemLabel);}function getBloodhoundRemote(){var remote={url:set.url?set.url:_getSetUrl(set),filter:function(response){var query=getQuery($(this).get(0).transport.lastReq);return _handleSetData(set,$.map(response,function(suggestion,i){return set.transform(set,suggestion,i,name,query)}));},rateLimitWait:set.debounceDelay};if(set.dataType==='jsonp'){remote['prepare']=function(query,settings){settings.dataType='jsonp';settings.url=settings.url.replace(set.queryVal,query);return settings;};}else{remote['wildcard']=set.queryVal;}return remote;}function getQuery(str){if(!$.exist(str,true))return str;str=decodeURIComponent(str);return str.substring(str.lastIndexOf(set.queryKey+'=')+(set.queryKey.length+1),str.lastIndexOf('GET'));}function displayVal(suggestion){return $.isFunction(set.itemLabel)?set.itemLabel.call(undefined,suggestion):$.dataVals(suggestion,set.itemLabel);}function source(query,sync,async){if(query.length<1&&set.defaultCall){if($.isString(set.defaultCall)){query=set.defaultCall;}else if($.isArray(set.defaultCall)){sync(_handleSetData(set,set.defaultCall));return;}else if($.exist(set.defaultCall.data)){sync(_handleSetData(set,set.defaultCall.transform(set,set.defaultCall.data)));return;}else if($.exist(set.defaultCall.url,true)){$.get(set.defaultCall.url,set.defaultCall.params,function(data){async(_handleSetData(set.defaultCall.transform(set,data)));return;});}}engine.search(query,sync,async);}}function _getSetUrl(set){var params={collection:set.collection};if($.exist(set.format,true))params['fmt']=set.format=='simple'?'json':'json++';if($.exist(set.alpha,true))params['alpha']=set.alpha;if($.exist(set.profile,true))params['profile']=set.profile;if($.exist(set.show,true))params['show']=set.show;if($.exist(set.sort,true))params['sort']=set.sort;if($.isObject(set.param))params=$.extend(true,{},params,set.params);return set.program+'?'+$.param(params)+'&'+set.queryKey+'='+set.queryVal;}function _groupSetData(set,results){var grouped={'':[]},i,len;if($.exist(set.groupOrder)){for(i=0,len=set.groupOrder.length;i<len;i++){grouped[set.groupOrder[i]]=[{label:set.groupOrder[i]}];}}for(i=0,len=results.length;i<len;i++){if(!$.exist(grouped[results[i][set.itemGroup]]))grouped[results[i][set.itemGroup]]=[{label:results[i][set.itemGroup]}];grouped[results[i][set.itemGroup]].push(results[i]);}results=[];$.each(grouped,function(groupName,group){if(group.length>1){if(!$.exist(groupName,true))group.splice(0,1);$.merge(results,group);}});return results;}function _handleSetData(set,results){results=results.slice(0,set.show);if(set.callback&&$.isFunction(set.callback))results=set.callback.call(undefined,set,results)||[];if(!set.group)return results;return _groupSetData(set,results);}function _processSetData(set,suggestion,i,name,query){return $.autocompletion.processSetData(set,suggestion,i,name,query);}function _renderSetWidth(menu,classWrapper,className){var cols=0,colsW=0,styles,parts,menuW=menu.width();className='.'+className;classWrapper='.'+classWrapper;$.each(menu.children(className),function(){parts=$(this).attr('class').split(' ');styles=$.cssStyle(classWrapper+' .'+parts[1])||$.cssStyle(classWrapper+' .'+parts.join('.'));if(styles.width&&styles.width.indexOf('important')&&styles.width.indexOf('auto')<0&&styles.width.indexOf('initial')<0&&styles.width.indexOf('inherit')<0){if(styles.width.indexOf('%')>0)colsW+=menuW*parseFloat(styles.width)/100;else colsW+=parseFloat(styles.width);}else if($.hasContent($(this)))cols++;});if(cols){menuW-=colsW+0.5;var minW=parseFloat(menu.children(className).css('min-width')),colW=menuW/cols;if(minW<=colW)menu.children(className).css('width',colW+'px');}}function _renderSetTemplate(set){_setSetTemplateHeader(set);if(!set.template||$.isEmptyObject(set.template))return{};$.each(set.template,function(k,obj){if($.isObject(obj))set.template[k]=obj.prop('outerHTML');});if(set.templateMerge){templateMerge('notFound');templateMerge('pending');}$.each(set.template,function(k,obj){if($.isString(obj))set.template[k]=Handlebars.compile(obj);});return set.template;function templateMerge(temp){if(set.template[temp]&&$.isString(set.template[temp])){if(set.template.header&&$.isString(set.template.header))set.template[temp]=set.template.header+set.template[temp];if(set.template.footer&&$.isString(set.template.footer))set.template[temp]+=set.template.footer;}}}function _setSetTemplateHeader(set){if(!set.template.header&&$.exist(set.name,true))set.template.header='<h5 class="tt-category">'+set.name+'</h5>';}function _selectItem(item,target){if($.exist(item.extra)){switch(item.extra.action_t){case'C':eval(item.extra.action);break;case'U':document.location=item.extra.action;break;case'E':target.typeahead('val',item.extra.action);break;case undefined:case'':case'S':case'Q':default:formSend(item.value);break;}}else{formSend(item.value);}function formSend(val){target.val(val);target.closest('form').submit();}}function _getSelectableLabel(item){return $.exist(item.data())?item.data().ttSelectableDisplay:item.text();}function _navCursorLR(code,cols,target){if(!$.exist(_navCols.cursor))return;var currCol=_navCols.cursor.parent(),currColIdx=cols.index(currCol),delta=code==37?-1:1,nextColItems=getNextColItems(currColIdx),cursorIdx=$(currCol).children('.tt-selectable').index(_navCols.cursor),nextCursor=$.exist(nextColItems[cursorIdx])?nextColItems[cursorIdx]:nextColItems[nextColItems.length-1];$(_navCols.cursor).removeClass('tt-cursor');_navCols.cursor=$(nextCursor).addClass('tt-cursor');target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));function getNextColItems(currColIdx){var nextColIdx=code==37?$.exist(cols[currColIdx-1])?currColIdx-1:cols.length-1:$.exist(cols[currColIdx+1])?currColIdx+1:0,nextColItems=$(cols[nextColIdx]).children('.tt-selectable');return $.exist(nextColItems)?nextColItems:getNextColItems(nextColIdx);}}function _navCursorUD(code,menu,target){if(!$.exist(menu.find('.tt-cursor'))){_navCols.cursor=code==38?menu.find('.tt-selectable').last():menu.find('.tt-selectable').first();_navCols.cursor.addClass('tt-cursor');_navCols.query=target.val();target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));return;}var currCol=_navCols.cursor.parent(),currColItems=$(currCol).children('.tt-selectable');if(!$.exist(currColItems))return;var cursorIdx=currColItems.index(_navCols.cursor),delta=code==38?-1:1;$(_navCols.cursor).removeClass('tt-cursor');if(!$.exist(currColItems[cursorIdx+delta])){_navCols.cursor=null;target.data().ttTypeahead.input.resetInputValue();target.data().ttTypeahead._updateHint();}else{_navCols.cursor=$(currColItems[cursorIdx+delta]).addClass('tt-cursor');target.data().ttTypeahead.input.setInputValue(_getSelectableLabel(_navCols.cursor));}}function logDebug(options,input,output,msg){if(!_debug||!window.console)return;console.log(msg);console.log('Options: ',options);console.log('Input: ',input);console.log('Output: ',output);console.log('--------');}function logInteraction(options,input,target,event){if(!options.logging||!$.exist(options.interactionLog,true))return;if(!input.dataset||!options.datasets[input.dataset])return;$.ajax({dataType:'jsonp',type:'GET',url:getInteractionUrl(options.datasets[input.dataset],input),}).fail(function(qXHR,textStatus,errorThrown){logDebug(options,input,qXHR,'Interaction log error: '+textStatus+' '+errorThrown);});function getInteractionUrl(set,suggestion){var params={collection:set.collection,type:event,partial_query:suggestion.query,client_time:new Date().getTime()};if($.exist(set.profile,true))params['profile']=set.profile;if($.exist(suggestion.extra))params=$.extend(true,{},params,suggestion.extra);return options.interactionLog+'?'+$.param(params);}}function Plugin(){var args=[].slice.call(arguments),option=args.shift();return this.each(function(){var $this=$(this),data=$this.data('flb.autocompletion'),options=$.extend(true,{},autocompletion.defaults,data||{},$.isObject(option)&&option);if(!data&&/destroy|hide/.test(option))return;if(!data)$this.data('flb.autocompletion',(data=new autocompletion(this,options)));if($.isString(option)&&$.isFunction(data[option]))data[option].apply($this,args);});}$.fn.autocompletion=Plugin;$.fn.autocompletion.Constructor=autocompletion;$.autocompletion={processSetData:function(set,suggestion,i,name,query){var value=suggestion.key,label=suggestion.key;if(suggestion.action_t=='Q')value=suggestion.action;if(suggestion.action_t=='S')value=suggestion.disp;if(suggestion.disp_t=='C')label=eval(suggestion.disp);else if(suggestion.disp)label=suggestion.disp;return{label:label,value:value,extra:suggestion,category:suggestion.cat?suggestion.cat:'',rank:i+1,dataset:name,query:query};},processSetDataFacets:function(set,suggestion,i,name,query){if(i!=='response'||!$.exist(suggestion.facets))return;var suggestions=[],rank=1;for(var i=0,leni=suggestion.facets.length;i<leni;i++){var facet=suggestion.facets[i];if(!$.exist(facet.allValues))continue;if($.exist(set.facets.blacklist)&&set.facets.blacklist.indexOf(facet.name)>-1)continue;if($.exist(set.facets.whitelist)&&set.facets.whitelist.indexOf(facet.name)<0)continue;for(var j=0,lenj=facet.allValues.length;j<lenj;j++){if($.exist(set.facets.show)&&j>parseInt(set.facets.show)-1)break;if(!facet.allValues[j].count)continue;suggestions.push({label:facet.allValues[j].label,value:facet.allValues[j].data,extra:{action:getUrl(facet.allValues[j]),action_t:'U'},category:facet.name,rank:rank++,dataset:name,query:query});}}return suggestions;function getUrl(facet){return($.exist(set.facets.url,true)?set.facets.url:window.location.origin+window.location.pathname)+facet.toggleUrl;}}}
$.exist=function(obj,bString){if(!$.isDefinied(bString))bString=false;var obj=bString?obj:$(obj);return $.isDefinied(obj)&&obj!=null&&($.isString(obj)?obj+'':obj).length>0;}
$.hasContent=function(obj){return obj.html().trim().length?true:false;}
$.isDefinied=function(obj){return typeof(obj)!=='undefined';}
$.isFunction=function(obj){return typeof(obj)==='function';}
$.isString=function(obj){return typeof(obj)==='string';}
$.isObject=function(obj){return typeof(obj)==='object';}
$.dataKeys=function(obj){return iterateKeys(obj,'');function iterateKeys(obj,prefix){return $.map(Object.keys(obj),function(key){if(obj[key]&&$.isObject(obj[key]))return iterateKeys(obj[key],key);else return(prefix?prefix+'-'+key:key);});}}
$.dataVals=function(obj,key){var parts=key.split('.'),key=parts.shift();if(parts.length){for(var i=0,len=parts.length;i<len;i++){obj=obj[key]||{};key=parts[i];}}return obj[key];}
$.cssStyle=function(className){var styleSheets=window.document.styleSheets,styles={};for(var i=0,leni=styleSheets.length;i<leni;i++){if(styleSheets[i].href&&styleSheets[i].href.indexOf(window.location.host)<0)continue;var classes=styleSheets[i].rules||styleSheets[i].cssRules;if(!classes)continue;for(var j=0,lenj=classes.length;j<lenj;j++){if(classes[j].selectorText!=className)continue;var properties=classes[j].style.cssText.split(';');for(var k=0,lenk=properties.length;k<lenk;k++){var part=properties[k].split(':');if(part.length==2)styles[part[0].trim()]=part[1].trim();}}}return styles;}}(jQuery));String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1);}