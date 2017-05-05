window.mainApp
.service('$blogconfig', function(F_Ads){
    $this = this;
    $this.ads_options = {}
    $this.ads_list = []; // length of ads records
    $this.ads_options.ads_length = 3; // how many ads will be shown in each article;
    $this.shuffled_ads = []; // array to contain ads which has been shuffled.
    F_Ads.get_components(
        function(res){
            $this.ads_list = res.list.map(function(res){return res.ad_url});
            $.each(res['options'], function(a,b){
                $this.ads_options[b.name] = b.value;
            })

        },
        function(){

        }
    )

    $this.shuffle_ads = function()
    {
        var ads_result = []
        if($this.shuffled_ads.length == $this.ads_list.length)
        {
            $this.shuffled_ads = [];
        }

        for (var i = 0; i < parseInt($this.ads_options.ads_length); i++) {
            var rand = Math.floor((Math.random() * $this.ads_list.length) + 1);            
            if( $this.ads_list[rand] && $this.shuffled_ads.indexOf(rand) < 0 && $this.shuffled_ads.length < $this.ads_list.length)
            {
                ads_result.push($this.ads_list[rand]);
                $this.shuffled_ads.push(rand);
            }else
            {
               i--;
            }
        }

        return ads_result;
    }

});