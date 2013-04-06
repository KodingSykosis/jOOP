$.cls({
    main: function(container) {
        this.container = container;
        this.talk();
    },
    talk: function() {
        this.container
            .append('Hello World, My name is ' + this.__pid__ + '\n');
    }
});