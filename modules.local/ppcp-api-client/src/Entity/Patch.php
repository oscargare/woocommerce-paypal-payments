<?php
declare(strict_types=1);

namespace Inpsyde\PayPalCommerce\ApiClient\Entity;


class Patch
{

    private $op;
    private $path;
    private $value;
    public function __construct(string $op, string $path, array $value)
    {
        $this->op = $op;
        $this->path = $path;
        $this->value = $value;
    }

    public function op() : string {
        return $this->op;
    }

    public function path() : string {
        return $this->path;
    }

    public function value() {
        return $this->value;
    }

    public function toArray() : array {
        return [
            'op' => $this->op(),
            'value' => $this->value(),
            'path' => $this->path(),
        ];
    }

    /**
     * Needed for the move operation. We currently do not
     * support the move operation.
     *
     * @return string
     */
    public function from() : string {
        return '';
    }
}