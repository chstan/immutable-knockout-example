$(document).ready(function () {
    var initialData = {
        'writer': {
            name: 'Dante Alighieri',
            role: 'Writer',
            born: 'June 1265'
        },
        'painter': {
            name: 'Sandro Botticelli',
            role: 'Painter',
            born: 'April 1446'
        }
    };

    var doMutations = false;

    function MutableVM () {
        var self = this;

        self.people = ko.observable(initialData);

        self.writer = ko.pureComputed(function () {
            return self.people().writer;
        }, self.people);

        self.painter = ko.pureComputed(function () {
            return self.people().painter;
        }, self.people);

        self.painter.subscribe(function() {
            console.log("The mutable value for the painter has changed:");
            console.log(JSON.stringify(self.painter(), null, 2));
        });

        if (doMutations) {
            var state = self.people();
            state.writer.role = 'Poet';
            self.people(state);
        }

        return self;
    };

    function ImmutableVM () {
        var self = this;

        self.people = ko.observable(Immutable.fromJS(initialData));
        self.people['equalityComparer'] = Immutable.is;

        self.writer = ko.pureComputed(function () {
            return self.people().get('writer');
        }, self.people);
        self.writer['equalityComparer'] = Immutable.is;

        self.painter = ko.pureComputed(function () {
            return self.people().get('painter');
        }, self.people);
        self.painter['equalityComparer'] = Immutable.is;

        self.painter.subscribe(function() {
            console.log("The immutable value for the painer has changed:");
            console.log(JSON.stringify(self.painter().toJS(), null, 2));
        });

        if (doMutations) {
            self.people(self.people().setIn(['writer', 'role'], 'Poet'));
        }

        return self;
    };

    ko.applyBindings(new MutableVM(), $('#mutable-target')[0]);
    ko.applyBindings(new ImmutableVM(), $('#immutable-target')[0]);
});
