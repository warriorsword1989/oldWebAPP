define(['../fastmap'], function (fastmap) {
    fastmap.mapApi.Bounds = function (left, bottom, right, top) {
        if (left) {
            this.left = parseFloat(left);
        }
        if (bottom) {
            this.bottom = parseFloat(bottom);
        }

        if (right) {
            this.right = parseFloat(right);
        }

        if (top) {
            this.top = parseFloat(top);
        }
    }

     /**
     * Method: clone
     * Create a cloned instance of this bounds.
     *
     * Returns:
     * {<fastmap.mapApi.Bounds >} A fresh copy of the bounds
     */
    fastmap.mapApi.Bounds.prototype.clone=function() {
        return new fastmap.mapApi.Bounds(this.left, this.bottom, this.right, this.top);
    },

    /**
     * Method: equals
     * Test a two bounds for equivalence.
     *
     * Parameters:
     * bounds - {<fastmap.mapApi.Bounds>}
     *
     * Returns:
     * {Boolean} The passed-in bounds object has the same left,
     *           right, top, bottom components as this.  Note that if bounds 
     *           passed in is null, returns false.
     */
    fastmap.mapApi.Bounds.prototype.equals=function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && 
                      (this.right == bounds.right) &&
                      (this.top == bounds.top) && 
                      (this.bottom == bounds.bottom));
        }
        return equals;
    }


});
