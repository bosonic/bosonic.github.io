(function() {
    

    Bosonic.registerElement(
        'b-hello-world',
        {
    readyCallback: function () {
        this.appendChild(this.template.content.cloneNode(true));
    },
    template: '        <p>Hello world!</p>    '
}
    );
}());