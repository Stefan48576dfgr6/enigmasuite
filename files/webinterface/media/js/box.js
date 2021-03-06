(function(){

    trans = window.translation;

    $('.confirmation').click(function(){
        return confirm(trans['are_you_sure']);
    });

    $unveil = $('.unveil');
    unveil_text = $unveil.text();
    $unveil.html('<a href="#">' + trans['show'] + '</a>');
    $unveil.on('click', function(){
        $unveil.html(unveil_text);
        return false;
    });

    $puppet_output = $('.puppet-output');

    if ($puppet_output.length){

        $puppet_output.height(parseInt($(window).height(), 10) - 400);

        if($('#loader-hint').data('value') == 'dry-run'){
            $('.loader').show();
            $('#button-dry-run, #button-run').attr('disabled', 'disabled');
        }

        if($('#loader-hint').data('value') == 'run'){
            $('.loader').show();
            $('#button-dry-run, #button-run').attr('disabled', 'disabled');

            setInterval(function(){
                ret = $.post('/api/v1/get_option', {
                    'key': 'config_changed'
                }, function(data){
                    if(data['value'] == 'False'){
                        $('.loader').hide();
                        $('#button-dry-run, #button-run, #button-apply').hide();
                        $('#success').fadeIn();
                    }
                });
            }, 2000);
        }

        prev_data = '';
        setInterval(function(){
            $puppet_output.load('/puppet_output/', function(data){
                if(data != prev_data){
                    $puppet_output.animate({ scrollTop: $('.puppet-output')[0].scrollHeight}, 1000);
                    prev_data = data;
                    if(data.indexOf('Finished catalog run') > -1){
                        $('#button-dry-run, #button-run, #button-apply').removeAttr('disabled');
                        $('.loader').hide();
                    }
                }
            });
        }, 1500);
    }

})();
