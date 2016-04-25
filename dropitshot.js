function dragAndDropFiles(options = {}) {

    // DEFINE DEFAULT PARAMS
    var params = {
        fadeIn: 200,
        fadeOut: 200,
        fadeOutDelay: 500,
        frame: {
            offset: 20,
            width: 7,
            radius: 20,
            style: 'dashed',
            color: 'white'
        },
        ajax: {
            url: '',
            async: true
        }
    };  

    // USE ARGUMENTS OPTIONS IF ANY
    setupParams(params, options);

    function setupParams(params, options) {
        for (var key in params) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }

            if (typeof(params[key]) === 'object') {
                setupParams(params[key], options[key]);
            } else {
                if (options[key] !== undefined) {
                    params[key] = options[key];
                }
            }
        }
    }

    function showDropZone() {
        $(dropzone).fadeIn(params.fadeIn);
    }

    function hideDropZone() {
        setTimeout(function() {
            $(dropzone).fadeOut(params.fadeOut);
        }, params.fadeOutDelay);
    }

    function allowDrag(e) {
        e.preventDefault();
    }

    function addEventHandler(obj, evt, handler) {
        if (obj.addEventListener) {
            // W3C method
            obj.addEventListener(evt, handler, false);
        } else if (obj.attachEvent) {
            // IE method.
            obj.attachEvent('on' + evt, handler);
        } else {
            // Old school method.
            obj['on' + evt] = handler;
        }
    }

    if (typeof $ === 'function') {
        $.fn.dropItsHot = function() {
            // INITIALIZE THE PLUGING IN HERE
            this.append('<h1>Pesho</h1>');
        }

        $('body').dropItsHot();
    }

    var fileInputs = document.getElementsByClassName('file-input');
    if (!fileInputs.length) return;

    var dropzone = document.createElement('div');
    var dzFrame = document.createElement('div');

    dropzone.id = 'dropzone';
    dzFrame.id = 'dz-frame';

    dropzone.appendChild(dzFrame);
    document.body.appendChild(dropzone);

    function resizeDropzone() {
        dzFrame.style.width = window.innerWidth - params.frame.offset + 'px';
        dzFrame.style.height = window.innerHeight - params.frame.offset + 'px';
    }

    resizeDropzone();

    dzFrame.style.margin = params.frame.offset / 2 + 'px';
    dzFrame.style.borderWidth = params.frame.width + 'px';
    dzFrame.style.borderRadius = params.frame.radius + 'px';
    dzFrame.style.borderStyle = params.frame.style;
    dzFrame.style.borderColor = params.frame.color;
    dzFrame.style.boxSizing = 'border-box';
    dropzone.style.display = 'none';

    window.addEventListener('dragenter', function(e) {
        showDropZone();
    });
    window.addEventListener('resize', function() {
        resizeDropzone();
    });

    dropzone.addEventListener('dragenter', allowDrag);

    dropzone.addEventListener('dragover', allowDrag);

    dropzone.addEventListener('dragleave', function(e) {
        hideDropZone();
    });

    addEventHandler(dropzone, 'drop', function(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }

        hideDropZone();


        var dt = e.dataTransfer;
        var files = dt.files;
        var modal = document.getElementById('modal');

        if ((modal !== null) && (modal.getAttribute('aria-hidden') === 'false')) {
            var fileInput = document.getElementById('modal').getElementsByClassName('file-input')[0];
        } else {
            var fileInput = fileInputs[0];
        }

        if (params.ajax.length) {
            var async = params.ajax.async !== 'undefined' ? params.ajax.async : true;

            var formData = new FormData();
            formData.append('file', files[0]);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', params.url, async);
            xhr.send(formData);
        } else {
            fileInput.files = files;
        }
    });
}
