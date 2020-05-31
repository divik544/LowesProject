$('#com').submit(function(e){
    e.preventDefault();
    var formData=$(this).serialize();
    var actionUrl=$(this).attr('action');
    
    $.post(actionUrl,formData,function(data){
        $('#comment-list').append(
        `
        <div class="row">
                        <div class="col-md-12">
                           <strong> ${data.author.username}</strong>
                            <span class="pull-right">a few seconds ago</span>
                             <p>
                             ${data.text}
                            </p>
                            <a class="btn btn-xs btn-warning" href="${actionUrl}/${data._id}/edit">
                                Edit
                            </a>
                            <form class="delete-form" action="${actionUrl}/${data._id}?_method=DELETE" method="POST">
                                <input type="submit" class="btn btn-xs btn-danger" value="Delete" >
                            </form>
                           
                            
                        </div>
                    </div>
        
        
        `
        )
        
        $('#com').find('.form-control').val(' ');
    });
    
});
