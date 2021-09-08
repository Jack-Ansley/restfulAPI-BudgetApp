from flask_restful import Resource, Api, fields, reqparse, marshal_with
from flask import Flask, render_template
from datetime import datetime



Cat_Fields = {
    'id': fields.Integer,
    'cat': fields.String,
    'budget': fields.Integer
}

Pur_Fields = {
    'date': fields.DateTime(dt_format='iso8601'),  # The otehr one made me import email stuff so we're using this one
    'item': fields.String,
    'cat': fields.String,
    'amount': fields.Integer
}

catParser = reqparse.RequestParser(trim=True)
catParser.add_argument('cat', type=str, required=True, location='json')
catParser.add_argument('budget', type=int, required=True, location='json')

purParser = reqparse.RequestParser(trim=True)
purParser.add_argument('date', type=str, default=datetime.now().isoformat(), location='json')
purParser.add_argument('item', type=str, required=True, location='json')
purParser.add_argument('cat_id', type=int, required=True, location='json')
purParser.add_argument('amount', type=int, required=True, location='json')

global_category_list = [{'id': 0, 'cat': 'Uncategorized', 'budget': 0.0}]
global_purchase_list = []


class CatList(Resource):
    def get(self):
        # return global list
        return global_category_list

    def post(self):
        in_id = len(global_category_list)

        # parse args to check for correctness then add to global list
        args = catParser.parse_args()

        category = {'id': in_id, 'cat': args['cat'], 'budget': args['budget']}
        global_category_list.append(category)
        return category, 200


# Don't delete purchase and make new one, we can just set existing purchase to Uncategorized and pick it up in the Post
# had issues with keeping id's correct so split this off into it's own thing. It is still restufl as seperate class
class SingleCat(Resource):
    def delete(self, id):
        if id >= 1:  # ID 0 is reserved for unaffiliated with category
            for purchase_iter in global_purchase_list:
                if purchase_iter["cat"] == global_category_list[id]["cat"]:
                    purchase_iter["cat"] = "Uncategorized"

            del global_category_list[id]
            return {}, 200


class PurList(Resource):
    @marshal_with(Pur_Fields)  # It cant jsonify if these aren't here, but idk why considering all they do
    # is enforce typing across fields. I do not know how it works but thats what stack overflow told me to do
    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument('month', type=str, help='This is the month (:')
        args = parser.parse_args()

        if args['month']:
            date = datetime.strptime(args['month'], "%m")
            parse_pur = [purchase for purchase
                         in global_purchase_list if
                         purchase["date"].month == date.month]
        else:
            parse_pur = global_purchase_list

        return parse_pur

    @marshal_with(Pur_Fields)
    def post(self):
        parsed_args = purParser.parse_args()
        date = datetime.strptime(parsed_args['date'], "%m-%d")
        new_purchase = {'date': date, 'item': parsed_args['item'],
                        'cat': global_category_list[parsed_args['cat_id']]['cat'],
                        'amount': parsed_args['amount']}
        global_purchase_list.append(new_purchase)
        return new_purchase, 200


app = Flask(__name__)

SECRET_KEY = 'development key'

Debug = True

app.config.from_object(__name__)

api = Api(app)
api.add_resource(CatList, '/cats/')
api.add_resource(SingleCat, '/cats/<int:id>')
api.add_resource(PurList, '/purchases/')


@app.route("/", methods=['GET', 'POST'])
def landing():
    return render_template("page.html")
