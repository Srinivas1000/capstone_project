module.exports = function(Event) {
  Event.beforeRemote('create', function(context, user, next) {
    context.args.data.createdDate = Date.now();
    context.args.data.updatedDate = Date.now();
    context.args.data.publisherId = context.req.accessToken.userId;
    next();
  });

  Event.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.updatedDate = new Date();
    } else {
      ctx.data.updatedDate = new Date();
    }
    next();
  });
};