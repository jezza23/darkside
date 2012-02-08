var path = require('path');
var util = require('util');

var Controller = require('./Controller');
var View = require('./View');
var ViewContext = require('./ViewContext');


var ViewController = function () {
	Controller.apply(this, arguments);

	this.layout_name_ = '@layout';

	this.view = new ViewContext();
};

util.inherits(ViewController, Controller);


ViewController.prototype.setTemplateRoot = function (template_root) {
	this.template_root_ = template_root;
};

ViewController.prototype.createView = function (relative_path) {
	var template_path = path.join(this.template_root_, relative_path);
	var view = new View(template_path);

	return view;
};

ViewController.prototype.setTemplatePath = function (page_template_path) {
	this.page_template_path_ = page_template_path;
};

ViewController.prototype.getLayout = function () {
	return this.layout_name_;
};

ViewController.prototype.setLayout = function (layout_name) {
	this.layout_name_ = layout_name || null;
};

ViewController.prototype.beforeRender = function () {
	var template_root = this.template_root_;

	var layout_name = this.getLayout();
	var layout_path = layout_name ? path.join(root, layout_name) : null;
	var page_path = path.join(root, this.getName() + 'Controller', this.getAction());
	var root_path = layout_path || page_path;

	var page_view = this.createView(page_path);
	this.view.pushView(page_view);

	if (root_path !== page_path) {
		var root_view = this.createView(root_path);
		this.view.pushView(root_view);
	}
};

ViewController.prototype.render = function (status) {
	this.beforeRender();

	this.view.execute(function (err, rendering) {
		if (err) {
			log(err.toString());
			this.response.end(500);
		} else {
			if (status) {
				this.response.head(status);
			}
			this.response.body(rendering);
			this.response.end();
		}
	}, this);
};


module.exports = ViewController;
